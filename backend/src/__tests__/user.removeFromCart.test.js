import {gql} from 'apollo-server-express'
import {print} from 'graphql'
import mongoose from 'mongoose'

import {dbConnect, dbDisconnect} from '#root/utils/dbConnection'
import graphqlCall from '#root/utils/graphqlCall'

import {user, item, cartItem} from '#root/models'

const REMOVE_FROM_CART_MUTATION = print(gql`
  mutation($id: ID!) {
    removeFromCart(id: $id) {
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

beforeAll(() => dbConnect())
afterAll(() => dbDisconnect())
afterEach(() =>
  Promise.all([
    user.deleteMany({}),
    item.deleteMany({}),
    cartItem.deleteMany({}),
  ]),
)

test('returns null when not logged in', async () => {
  const variables = {id: new mongoose.Types.ObjectId().toString()}

  const {errors} = await graphqlCall(REMOVE_FROM_CART_MUTATION, null, variables)

  expect(errors[0].message).toMatch(/you must be logged in to do that/i)
})

test('returns error when CartItem not found', async () => {
  const newUser = await user.create({
    name: 'Test',
    email: 'test@test.com',
    password: 'sdajnj2312',
  })

  const variables = {id: new mongoose.Types.ObjectId().toString()}

  const context = {req: {userId: newUser.id}, res: {}}

  const {errors} = await graphqlCall(
    REMOVE_FROM_CART_MUTATION,
    context,
    variables,
  )

  expect(errors[0].message).toMatch(/no cartitem found/i)
})

test('returns and removes cart item', async () => {
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

  const variables = {id: newCartItem.id}

  const context = {req: {userId: newUser.id}, res: {}}

  const {data} = await graphqlCall(
    REMOVE_FROM_CART_MUTATION,
    context,
    variables,
  )

  expect(data.removeFromCart).toHaveProperty('_id', newCartItem.id)
  expect(data.removeFromCart.item).toHaveProperty('_id', newItem.id)

  const foundCartItem = await cartItem.findById(newCartItem.id).select('_id')

  expect(foundCartItem).toBeNull()
})
