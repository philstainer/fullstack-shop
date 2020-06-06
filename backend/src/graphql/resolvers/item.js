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
    item: async (parent, args, ctx, info) => {
      const selected = selectedFields(info)

      return ctx.db.item.findById(args.id).select(selected).lean()
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
      return createdItem
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

      const selected = selectedFields(info)

      return ctx.db.item.findByIdAndRemove(args.id).select(selected).lean()
    },
    updateItem: async (parent, {id, ...updates}, ctx, info) => {
      isAuthenticated(ctx)

      if (Object.keys(updates).length === 0) {
        throw new Error('Nothing to update')
      }

      const item = await ctx.db.item.findById(id).select('_id createdBy').lean()

      if (!item) {
        throw new Error('Item does not exist')
      }

      const isOwner = item.createdBy.toString() === ctx.req.user._id.toString()
      const hasPermissions = ctx.req.user.permissions.some(permission =>
        ['ADMIN', 'ITEMUPDATE'].includes(permission),
      )

      if (!isOwner && !hasPermissions) {
        throw new Error("You don't have permission to do that!")
      }

      const selected = selectedFields(info)

      return ctx.db.item
        .findByIdAndUpdate(
          id,
          {...updates, updatedBy: ctx.req.user._id},
          {new: true},
        )
        .select(selected)
        .lean()
    },
  },
}

export default resolvers
