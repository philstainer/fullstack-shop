import {gql} from 'apollo-server-express'
import {print} from 'graphql'
import mongoose from 'mongoose'

import {
  connect,
  closeDatabase,
  clearDatabase,
} from '#root/utils/dbConnectionTest'
import graphqlCall from '#root/utils/graphqlCall'

import {user, item, cartItem} from '#root/models'

const ADD_TO_CART_MUTATION = print(gql`
  mutation($id: ID!) {
    addToCart(id: $id) {
      _id
      quantity
      item {
        _id
        title
        description
        imageUrl
        price
      }
    }
  }
`)

beforeAll(() => connect())
afterAll(() => closeDatabase())
afterEach(() => clearDatabase())

test('returns null when not logged in', async () => {
  const variables = {id: new mongoose.Types.ObjectId().toString()}

  const {errors} = await graphqlCall(ADD_TO_CART_MUTATION, null, variables)

  expect(errors[0].message).toMatch(/you must be logged in to do that/i)
})

test('increment the quantity when already in cart', async () => {
  const newUser = await user.create({
    name: 'Test',
    email: 'test@test.com',
    password: 'sdajnj2312',
  })

  const newItem = await item.create({
    title: 'title',
    description: 'desc',
    imageUrl: 'http://testx.com',
    price: 19,
  })

  const newCartItem = await cartItem.create({
    quantity: 1,
    user: newUser._id,
    item: newItem._id,
  })

  const variables = {id: newItem.id}

  const context = {
    req: {userId: newUser.id},
    res: {},
  }

  const {data} = await graphqlCall(ADD_TO_CART_MUTATION, context, variables)

  expect(data.addToCart).toHaveProperty('_id', newCartItem.id)
  expect(data.addToCart).toHaveProperty('quantity', 2)
  expect(data.addToCart.item).toHaveProperty('_id', newItem.id)
})

test('create cart item when not in cart', async () => {
  const newUser = await user.create({
    name: 'Test',
    email: 'test@test.com',
    password: 'sdajnj2312',
  })

  const newItem = await item.create({
    title: 'title',
    description: 'desc',
    imageUrl: 'http://testx.com',
    price: 19,
  })

  const variables = {id: newItem.id}

  const context = {
    req: {userId: newUser.id},
    res: {},
  }

  const {data} = await graphqlCall(ADD_TO_CART_MUTATION, context, variables)

  expect(data.addToCart).toHaveProperty('_id')
  expect(data.addToCart).toHaveProperty('quantity', 1)
  expect(data.addToCart.item).toHaveProperty('_id')
})
