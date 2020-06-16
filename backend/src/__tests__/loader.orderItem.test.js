import mongoose from 'mongoose'

import {
  connect,
  closeDatabase,
  clearDatabase,
} from '#root/utils/dbConnectionTest'
import loader from '#root/graphql/loaders/orderItem'

import {order, orderItem} from '#root/models'

beforeAll(() => connect())
afterAll(() => closeDatabase())
afterEach(() => clearDatabase())

test('returns null if not found', async () => {
  const data = await loader.orderItems.load(new mongoose.Types.ObjectId())

  expect(data).toBeNull()
})

test('returns multiple orderItems', async () => {
  const newOrder = await order.create({
    total: 99,
    charge: '99',
    user: new mongoose.Types.ObjectId(),
  })

  const newOrderItem = await orderItem.create({
    title: 'title',
    description: 'desc',
    imageUrl: 'http://testx.com',
    price: 99,
    amount: 1,
    order: newOrder._id,
  })

  const newOrderItem2 = await orderItem.create({
    title: 'title 2',
    description: 'desc',
    imageUrl: 'http://testx.com',
    price: 99,
    amount: 1,
    order: newOrder._id,
  })

  const data = await loader.orderItems.load(newOrder._id)

  expect(data[0]).toHaveProperty('title', newOrderItem.title)
  expect(data[1]).toHaveProperty('title', newOrderItem2.title)
})

test('returns single orderItems', async () => {
  const newOrder = await order.create({
    total: 99,
    charge: '99',
    user: new mongoose.Types.ObjectId(),
  })

  const newOrderItem = await orderItem.create({
    title: 'title',
    description: 'desc',
    imageUrl: 'http://testx.com',
    price: 99,
    amount: 1,
    order: newOrder._id,
  })

  const data = await loader.orderItems.load(newOrder._id)

  expect(data[0]).toHaveProperty('title', newOrderItem.title)
})
