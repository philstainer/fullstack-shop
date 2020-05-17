import isAuthenticated from '#root/utils/isAuthenticated'
import selectedFields from '#root/utils/selectedFields'
import hasPermission from '#root/utils/hasPermission'
import {createItem} from '#root/JoiSchemas'

const resolvers = {
  Query: {
    items: async (parent, {limit, skip}, ctx, info) => {
      const selected = selectedFields(info)

      const items = await ctx.db.item
        .find()
        .limit(limit || 10)
        .skip(skip || 0)
        .select(selected)
        .lean()

      return items
    },
  },
  Mutation: {
    createItem: async (parent, args, ctx, info) => {
      isAuthenticated(ctx)

      hasPermission(ctx.req.user, ['ADMIN', 'ITEMCREATE'])

      // Validate input
      await createItem.validateAsync(args, {abortEarly: false})

      const createdItem = await ctx.db.item.create({
        ...args,
        createdBy: ctx.req.user._id,
      })

      // return createdItem
      return {...createdItem._doc, createdBy: ctx.req.user}
    },
  },
}

export default resolvers
