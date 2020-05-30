import isAuthenticated from '#root/utils/isAuthenticated'
import selectedFields from '#root/utils/selectedFields'
import hasPermission from '#root/utils/hasPermission'
import {createItem} from '#root/JoiSchemas'

const resolvers = {
  Query: {
    items: async (parent, {limit, skip}, ctx, info) => {
      const selected = selectedFields(info, ['createdBy', 'updatedBy'])

      const items = await ctx.db.item
        .find()
        .limit(limit || 10)
        .skip(skip || 0)
        .select(selected)
        .lean()

      return items
    },
    itemsConnection: async (parent, args, ctx, info) => {
      const totalCount = ctx.db.item.estimatedDocumentCount()

      return {
        totalCount,
      }
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
    deleteItem: async (parent, args, ctx, info) => {
      isAuthenticated(ctx)

      const item = await ctx.db.item
        .findById(args.id)
        .select('_id createdBy')
        .lean()

      if (!item) {
        throw new Error('Item does not exist')
      }

      const isOwner = item.createdBy.toString() === ctx.req.user._id.toString()
      const hasPermissions = ctx.req.user.permissions.some(permission =>
        ['ADMIN', 'ITEMDELETE'].includes(permission),
      )

      if (!isOwner && !hasPermissions) {
        throw new Error("You don't have permission to do that!")
      }

      const selected = selectedFields(info, ['createdBy', 'updatedBy'])

      return ctx.db.item.findByIdAndRemove(args.id).select(selected).lean()
    },
  },
}

export default resolvers
