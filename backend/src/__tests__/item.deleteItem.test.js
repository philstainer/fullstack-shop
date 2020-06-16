import mongoose from 'mongoose'

import {
  connect,
  closeDatabase,
  clearDatabase,
} from '#root/utils/dbConnectionTest'
import graphqlCall from '#root/utils/graphqlCall'

import {user, item} from '#root/models'

const DELETE_ITEM_MUTATION = `
  mutation($id: ID!) {
    deleteItem(id: $id) {
      _id
      title
      description
      imageUrl
      price
    }
  }
`

const fakeUser = {
  name: 'Test',
  email: 'test@test.com',
  password: 'Password123!',
}

const fakeItem = {
  title: 'Title',
  description: 'Description',
  imageUrl: 'https://someurl.com',
  price: 9999,
}

beforeAll(() => connect())
afterAll(() => closeDatabase())
afterEach(() => clearDatabase())

test('throws error when not logged in', async () => {
  const variables = {id: 12345}

  const {errors} = await graphqlCall(DELETE_ITEM_MUTATION, null, variables)

  expect(errors[0].message).toMatch(/you must be logged in to do that/i)
})

test('throws error when item not found', async () => {
  const createdUser = await user.create({
    ...fakeUser,
  })

  const context = {
    req: {
      userId: createdUser._id,
    },
  }

  const variables = {id: new mongoose.Types.ObjectId().toString()}

  const {errors} = await graphqlCall(DELETE_ITEM_MUTATION, context, variables)

  expect(errors[0].message).toMatch(/item does not exist/i)
})

test('throws error when authorization fails', async () => {
  const createdUser = await user.create({
    ...fakeUser,
  })

  const createdItem = await item.create({
    ...fakeItem,
    createdBy: new mongoose.Types.ObjectId(),
  })

  const context = {
    req: {
      userId: createdUser.id,
      user: createdUser,
    },
  }

  const variables = {id: createdItem.id}

  const {errors} = await graphqlCall(DELETE_ITEM_MUTATION, context, variables)

  expect(errors[0].message).toMatch(/have permission to do that/i)
})

test('deletes and returns item', async () => {
  const createdUser = await user.create({
    ...fakeUser,
  })

  const createdItem = await item.create({
    ...fakeItem,
    createdBy: createdUser._id,
  })

  const context = {
    req: {
      userId: createdUser.id,
      user: createdUser,
    },
  }

  const variables = {id: createdItem.id}

  const {data} = await graphqlCall(DELETE_ITEM_MUTATION, context, variables)

  expect(data.deleteItem).toHaveProperty('_id', createdItem.id)

  const deletedItem = await item.findById(createdItem._id).select('_id').lean()

  expect(deletedItem).toBeNull()
})
