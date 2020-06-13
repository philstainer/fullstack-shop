import {gql} from 'apollo-server-express'
import {print} from 'graphql'

import {dbConnect, dbDisconnect} from '#root/utils/dbConnection'
import graphqlCall from '#root/utils/graphqlCall'

import {user, order, orderItem} from '#root/models'

const ORDERS_QUERY = print(gql`
  query orders {
    orders {
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
        name
      }
    }
  }
`)

beforeAll(() => dbConnect())
afterAll(() => dbDisconnect())
afterEach(() =>
  Promise.all([
    user.deleteMany({}),
    order.deleteMany({}),
    orderItem.deleteMany({}),
  ]),
)

test('throws error when not logged in', async () => {
  const {errors} = await graphqlCall(ORDERS_QUERY, null, null)

  expect(errors[0].message).toMatch(/you must be logged in to do that/i)
})

test('returns orders', async () => {
  const createdUser = await user.create({
    name: 'Test',
    email: 'test@test.com',
    password: 'Password123!',
  })

  const amount = 9999

  const newOrder = await order.create({
    total: amount,
    charge: `${amount}`,
    user: createdUser._id,
  })

  const newOrderItem = await orderItem.create({
    title: 'title',
    description: 'desc',
    imageUrl: 'http://testx.com',
    price: amount,
    quantity: 1,
    order: newOrder._id,
  })

  const context = {
    req: {
      userId: createdUser._id,
    },
  }

  const {data} = await graphqlCall(ORDERS_QUERY, context, null)

  expect(data.orders[0]).toHaveProperty('_id', newOrder.id)
  expect(data.orders[0].items[0]).toHaveProperty('_id', newOrderItem.id)
  expect(data.orders[0].user).toHaveProperty('_id', createdUser.id)
})
