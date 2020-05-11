import isAuthenticated from '#root/utils/isAuthenticated'
import selectedFields from '#root/utils/selectedFields'
import hasPermission from '#root/utils/hasPermission'
import {createItem} from '#root/JoiSchemas'

const resolvers = {
  Query: {},
  Mutation: {
    createItem: async (parent, args, ctx, info) => {
      isAuthenticated(ctx)

      hasPermission(ctx.req.user, ['ADMIN', 'ITEMCREATE'])

      // Validate input
      await createItem.validateAsync(args, {abortEarly: false})

      const createdItem = await ctx.db.item.create(args)

      return createdItem
    },
  },
}

export default resolvers
