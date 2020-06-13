import isAuthenticated from '#root/utils/isAuthenticated'
import selectedFields from '#root/utils/selectedFields'
import {transport, basicTemplate} from '#root/utils/mail'
import stripe from '#root/utils/stripe'

const resolvers = {
  Query: {
    orders: async (parent, args, ctx, info) => {
      isAuthenticated(ctx)

      const selected = selectedFields(info, 'items')

      return ctx.db.order.find({user: ctx.req.userId}).select(selected).lean()
    },
  },
  Mutation: {
    createOrder: async (parent, {token}, ctx, info) => {
      isAuthenticated(ctx)

      // User Cart
      const cart = await ctx.db.cartItem
        .find({user: ctx.req.userId})
        .select('quantity item')
        .lean()
        .populate({
          path: 'item',
          select: '-_id title description imageUrl price',
        })

      // Calculate Amount
      const amount = cart.reduce(
        (total, cartItem) => total + cartItem.item.price * cartItem.quantity,
        0,
      )

      // Stripe Charge
      const charge = await stripe.charges.create({
        amount,
        currency: 'GBP',
        source: token,
      })

      // Create Order
      const newOrder = await ctx.db.order.create({
        total: charge.amount,
        charge: charge.id,
        user: ctx.req.userId,
      })

      // Create Order Items
      const orderItems = cart.map(cartItem => ({
        ...cartItem.item,
        quantity: cartItem.quantity,
        order: newOrder._id,
      }))

      await ctx.db.orderItem.insertMany(orderItems)

      // Remove items from user cart
      const cartItemIds = cart.map(item => item._id)

      await ctx.db.cartItem.deleteMany({
        _id: {$in: cartItemIds},
      })

      return newOrder
    },
  },
  Order: {
    items: (parent, args, ctx, info) => {
      const selected = selectedFields(info)

      return ctx.db.orderItem.find({order: parent._id}).select(selected).lean()
    },
    user: (parent, args, ctx, info) => {
      const selected = selectedFields(info)

      return ctx.db.user.findById(parent.user).select(selected).lean()
    },
  },
}

export default resolvers
