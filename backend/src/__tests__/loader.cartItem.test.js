import mongoose from 'mongoose'

import {
  connect,
  closeDatabase,
  clearDatabase,
} from '#root/utils/dbConnectionTest'
import loader from '#root/graphql/loaders/cartItem'

import {cartItem, item} from '#root/models'

beforeAll(() => connect())
afterAll(() => closeDatabase())
afterEach(() => clearDatabase())

test('returns [] if not found', async () => {
  const data = await loader.cartItems.load(new mongoose.Types.ObjectId())

  expect(data).toEqual([])
})

test('returns multiple cartItems', async () => {
  const id = new mongoose.Types.ObjectId()

  const newItem = await item.create({
    title: 'title',
    description: 'desc',
    imageUrl: 'http://testx.com',
    price: 19,
  })

  const newItem2 = await item.create({
    title: 'title 2',
    description: 'desc',
    imageUrl: 'http://testx.com',
    price: 19,
  })

  const newCartItem1 = await cartItem.create({
    quantity: 1,
    user: id,
    item: newItem._id,
  })

  const newCartItem2 = await cartItem.create({
    quantity: 2,
    user: id,
    item: newItem2._id,
  })

  const data = await loader.cartItems.load(id)

  expect(data[0]).toHaveProperty('quantity', newCartItem1.quantity)
  expect(data[0].item).toHaveProperty('title', newItem.title)

  expect(data[1]).toHaveProperty('quantity', newCartItem2.quantity)
  expect(data[1].item).toHaveProperty('title', newItem2.title)
})

test('returns single cartItems', async () => {
  const id = new mongoose.Types.ObjectId()

  const newItem = await item.create({
    title: 'title',
    description: 'desc',
    imageUrl: 'http://testx.com',
    price: 19,
  })

  const newCartItem = await cartItem.create({
    quantity: 1,
    user: id,
    item: newItem._id,
  })

  const data = await loader.cartItems.load(id)

  expect(data[0]).toHaveProperty('quantity', newCartItem.quantity)
  expect(data[0].item).toHaveProperty('title', newItem.title)
})
