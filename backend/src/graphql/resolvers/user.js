'use strict'

import bcrypt from 'bcryptjs'

import isAuthenticated from '#root/utils/isAuthenticated'
import {signUpSchema, requestReset, resetPassword} from '#root/JoiSchemas'
import selectedFields from '#root/utils/selectedFields'
import generateUserCookie from '#root/utils/generateUserCookie'
import {transport, basicTemplate} from '#root/utils/mail'
import generateToken from '#root/utils/generateToken'

const resolvers = {
  Query: {
    me: async (parent, args, ctx, info) => {
      if (!ctx?.req?.userId) return null

      const selected = selectedFields(info)

      const foundUser = await ctx.db.user
        .findById(ctx.req.userId)
        .select(selected)
        .lean()

      if (!foundUser) ctx.res.clearCookie('token')

      return foundUser
    },
  },
  Mutation: {
    signUp: async (parent, args, ctx, info) => {
      // Check logged in
      if (ctx?.req?.userId) throw new Error('You are already logged in!')

      // Validate input
      await signUpSchema.validateAsync(args, {abortEarly: false})

      // Hash password
      const password = await bcrypt.hash(args.password, 10)

      // Generate Confirm account token
      const token = await generateToken()

      // Create user
      // hour * minute * second * millisecond
      const createdUser = await ctx.db.user.create({
        ...args,
        password,
        confirmToken: token,
        confirmTokenExpiry: Date.now() + 1 * 60 * 60 * 1000,
      })

      // Send confirm account email
      await transport.sendMail({
        from: 'noreply@fullstackshop.com',
        to: createdUser.email,
        subject: 'Please confirm your account!',
        html: basicTemplate(`Confirm your account with us!
          \n\n
          <a href="${process.env.FRONTEND_URL}/confirm?confirmToken=${token}">Click here to confirm</a>`),
      })

      // Generate Cookie
      generateUserCookie(createdUser, ctx)

      return createdUser
    },
    signOut: (parent, args, ctx, info) => {
      isAuthenticated(ctx)

      ctx.res.clearCookie('token')

      return {status: 'Success', message: 'See you soon'}
    },
    signIn: async (parent, {email, password}, ctx, info) => {
      const errorMessage = 'Incorrect email or password'

      const selected = selectedFields(info)

      // Check user
      const foundUser = await ctx.db.user
        .findOne({email})
        .select(`${selected} password`)
        .lean()

      if (!foundUser) throw new Error(errorMessage)

      // Check password
      const isValid = await bcrypt.compare(password, foundUser.password)

      if (!isValid) throw new Error(errorMessage)

      // Generate Cookie
      generateUserCookie(foundUser, ctx)

      return foundUser
    },
    confirmAccount: async (parent, {confirmToken}, ctx, info) => {
      const errorMessage = 'Token invalid or expired'

      const foundUser = await ctx.db.user
        .findOne({
          confirmToken,
          confirmTokenExpiry: {$gte: Date.now()}, // Confirm token expiry > Date.now
        })
        .select('_id')
        .lean()

      if (!foundUser) throw new Error(errorMessage)

      await ctx.db.user
        .findByIdAndUpdate(foundUser._id, {
          confirmed: true,
          confirmToken: null,
          confirmTokenExpiry: null,
        })
        .select('_id')
        .lean()

      return {
        status: 'Success',
        message: 'Account has now been confirmed, please log in!',
      }
    },
    requestConfirm: async (parents, args, ctx, info) => {
      isAuthenticated(ctx)

      const foundUser = await ctx.db.user
        .findById(ctx.req.userId)
        .select('confirmed email')
        .lean()

      if (!foundUser) throw new Error('Problem with requesting confirm token')
      if (foundUser?.confirmed)
        throw new Error('Account has already been confirmed')

      // Generate Confirm account token
      const token = await generateToken()

      // Update user
      await ctx.db.user.findByIdAndUpdate(ctx.req.userId, {
        confirmToken: token,
        confirmTokenExpiry: Date.now() + 1 * 60 * 60 * 1000,
      })

      // Send confirm account email
      await transport.sendMail({
        from: 'noreply@fullstackshop.com',
        to: foundUser.email,
        subject: 'Please confirm your account!',
        html: basicTemplate(`Confirm your account with us!
          \n\n
          <a href="${process.env.FRONTEND_URL}/confirm?confirmToken=${token}">Click here to confirm</a>`),
      })

      return {
        status: 'Success',
        message: 'Email sent! please confirm your account',
      }
    },
    requestReset: async (parent, {email}, ctx, info) => {
      // Check logged in
      if (ctx?.req?.userId) throw new Error('You are already logged in!')

      // Validate input
      await requestReset.validateAsync({email})

      const successObject = {
        status: 'Success',
        message: 'Email sent to your account',
      }

      const user = await ctx.db.user.findOne({email}).select('_id').lean()

      if (user) {
        // Generate Confirm account token
        const token = await generateToken()

        // Update user
        await ctx.db.user.findByIdAndUpdate(user._id, {
          resetToken: token,
          resetTokenExpiry: Date.now() + 15 * 60 * 1000,
        })

        // Send confirm account email
        await transport.sendMail({
          from: 'noreply@fullstackshop.com',
          to: email,
          subject: 'Your Password Reset Token',
          html: basicTemplate(`Your Password Reset Token is here!
    \n\n
    <a href="${process.env.FRONTEND_URL}/reset?resetToken=${token}">Click here to Reset</a>`),
        })
      }

      return successObject
    },
    resetPassword: async (parent, args, ctx, info) => {
      // Validate input
      await resetPassword.validateAsync(args, {abortEarly: false})

      const foundUser = await ctx.db.user
        .findOne({
          resetToken: args.resetToken,
          resetTokenExpiry: {$gte: Date.now()}, // Confirm token expiry > Date.now
        })
        .select('_id')
        .lean()

      if (!foundUser) throw new Error('Token invalid or expired')

      const selected = selectedFields(info)

      // Hash password
      const password = await bcrypt.hash(args.password, 10)

      // Update user
      const updatedUser = await ctx.db.user
        .findByIdAndUpdate(
          foundUser._id,
          {
            password,
            resetToken: null,
            resetTokenExpiry: null,
          },
          {new: true},
        )
        .select(selected)
        .lean()

      generateUserCookie(updatedUser, ctx)

      return updatedUser
    },
  },
}

export default resolvers
