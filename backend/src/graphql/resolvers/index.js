'use strict'

import merge from 'lodash.merge'
import graphqlFields from 'graphql-fields'

const _empty = {
  Query: {
    me: async (parent, args, ctx, info) => {
      const topLevelFields = Object.keys(graphqlFields(info)).join(' ')

      const users = await ctx.db.user.find({}).select(topLevelFields).lean()

      console.log(users)

      return users[0]
    },
  },
}

const resolvers = merge(_empty)

export default resolvers
