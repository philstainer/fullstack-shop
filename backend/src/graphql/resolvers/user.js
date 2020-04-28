'use strict'

import bcrypt from 'bcryptjs'

import isAuthenticated from '#root/utils/isAuthenticated'
import {signUpSchema} from '#root/JoiSchemas'
import selectedFields from '#root/utils/selectedFields'
import generateUserCookie from '#root/utils/generateUserCookie'
import {transport, basicTemplate} from '#root/utils/mail'
import generateToken from '#root/utils/generateToken'

const resolvers = {
  Query: {
    me: (parent, args, ctx, info) => {
      isAuthenticated(ctx)

      const selected = selectedFields(info)

      return ctx.db.user.findById(ctx.req.userId).select(selected).lean()
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

      // Check user
      const foundUser = await ctx.db.user.findOne({email}).lean()

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

      const foundUser = await ctx.db.user.findOne({
        confirmToken,
        confirmTokenExpiry: {$gte: Date.now()}, // Confirm token expiry > Date.now
      })

      if (!foundUser) throw new Error(errorMessage)

      await ctx.db.user.findByIdAndUpdate(foundUser.id, {
        confirmToken: null,
        confirmTokenExpiry: null,
      })

      return {
        status: 'Success',
        message: 'Account has now been confirmed, please log in!',
      }
    },
  },
}

export default resolvers
