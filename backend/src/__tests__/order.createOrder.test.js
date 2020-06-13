import {gql} from 'apollo-server-express'
import {print} from 'graphql'
import loader from '#root/graphql/loaders'

import {dbConnect, dbDisconnect} from '#root/utils/dbConnection'
import graphqlCall from '#root/utils/graphqlCall'
import stripe from '#root/utils/stripe'

import {user, item, cartItem, order, orderItem} from '#root/models'

const CREATE_ORDER_MUTATION = print(gql`
  mutation($token: String!) {
    createOrder(token: $token) {
      _id
      total
      charge
      items {
        _id
        title
        description
        imageUrl
        price
        quantity
      }
      user {
        _id
      }
    }
  }
`)

beforeAll(() => dbConnect())
afterAll(() => dbDisconnect())
afterEach(() =>
  Promise.all([
    user.deleteMany({}),
    item.deleteMany({}),
    cartItem.deleteMany({}),
    order.deleteMany({}),
    orderItem.deleteMany({}),
  ]),
)

test('throws error when not logged in', async () => {
  const variables = {
    token: 'fakeToken123',
  }

  const {errors} = await graphqlCall(CREATE_ORDER_MUTATION, null, variables)

  expect(errors[0].message).toMatch(/you must be logged in to do that/i)
})

test('creates stripe charge, create order, clear cart and return order', async () => {
  const createdUser = await user.create({
    name: 'Test',
    email: 'test@test.com',
    password: 'Password123!',
  })

  const amount = 19999

  const newItem = await item.create({
    title: 'title',
    description: 'desc',
    imageUrl: 'http://testx.com',
    price: amount,
  })

  await cartItem.create({
    quantity: 1,
    user: createdUser._id,
    item: newItem._id,
  })

  const token = 'fakeToken123'

  const variables = {
    token,
  }

  const context = {
    req: {
      userId: createdUser._id,
    },
    loader,
  }

  const id = '12345'
  stripe.charges.create = jest.fn(() => ({id, amount}))

  const {data} = await graphqlCall(CREATE_ORDER_MUTATION, context, variables)

  expect(stripe.charges.create).toHaveBeenCalledWith({
    amount,
    currency: 'GBP',
    source: token,
  })

  expect(data.createOrder).toHaveProperty('_id')
  expect(data.createOrder).toHaveProperty('total', amount)
  expect(data.createOrder).toHaveProperty('charge', id)
  expect(data.createOrder.items).toHaveLength(1)
  expect(data.createOrder.user).toHaveProperty('_id')

  // Check mongo documents
  const createdOrder = await order.findOne({user: createdUser._id}).lean()
  expect(createdOrder).toHaveProperty('charge', id)

  const createdOrderItems = await orderItem
    .find({order: createdOrder._id})
    .lean()
  expect(createdOrderItems).toHaveLength(1)

  const cartItems = await cartItem.find({user: createdUser._id})
  expect(cartItems).toHaveLength(0)
})
