import {gql} from 'apollo-server-express'
import {print} from 'graphql'

import {dbConnect, dbDisconnect} from '#root/utils/dbConnection'
import graphqlCall from '#root/utils/graphqlCall'

import {user, order, orderItem} from '#root/models'

const ORDER_QUERY = print(gql`
  query order($id: ID!) {
    order(id: $id) {
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
  const variables = {id: '12345'}

  const {errors} = await graphqlCall(ORDER_QUERY, null, variables)

  expect(errors[0].message).toMatch(/you must be logged in to do that/i)
})

test('returns orders', async () => {
  const createdUser = await user.create({
    name: 'Test',
    email: 'test@test.com',
    password: 'Password123!',
  })

  const newOrder = await order.create({
    total: 99,
    charge: '99',
    user: createdUser._id,
  })

  const newOrderItem = await orderItem.create({
    title: 'title',
    description: 'desc',
    imageUrl: 'http://testx.com',
    price: 99,
    quantity: 1,
    order: newOrder._id,
  })

  const context = {
    req: {
      userId: createdUser._id,
    },
  }

  const variables = {id: newOrder.id}

  const {data} = await graphqlCall(ORDER_QUERY, context, variables)

  expect(data.order).toHaveProperty('_id', newOrder.id)
  expect(data.order.items[0]).toHaveProperty('_id', newOrderItem.id)
  expect(data.order.user).toHaveProperty('_id', createdUser.id)
})
