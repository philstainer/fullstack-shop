'use strict'

import bcrypt from 'bcryptjs'

import isAuthenticated from '#root/utils/isAuthenticated'
import {signUpSchema} from '#root/JoiSchemas'
import selectedFields from '#root/utils/selectedFields'
import generateUserCookie from '#root/utils/generateUserCookie'

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

      // Create user
      const createdUser = await ctx.db.user.create({...args, password})

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
  },
}

export default resolvers
