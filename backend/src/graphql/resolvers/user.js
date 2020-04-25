'use strict'

import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

import isAuthenticated from '#root/utils/isAuthenticated'
import {signUpSchema} from '#root/JoiSchemas'
import selectedFields from '#root/utils/selectedFields'

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

      // Create token
      const token = jwt.sign({sub: createdUser.id}, process.env.JWT_SECRET)

      // Set token for 365 days
      ctx.res.cookie('token', token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 365,
      })

      return createdUser
    },
  },
}

export default resolvers
