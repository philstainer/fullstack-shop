import mongoose from 'mongoose'

import {dbConnect, dbDisconnect} from '#root/utils/dbConnection'
import graphqlCall from '#root/utils/graphqlCall'

import {user, item} from '#root/models'

const UPDATE_ITEM_MUTATION = `
  mutation(
    $id: ID!
    $title: String
    $description: String
    $imageUrl: String
    $price: Int
  ) {
    updateItem(
      id: $id
      title: $title
      description: $description
      imageUrl: $imageUrl
      price: $price
    ) {
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

beforeAll(() => dbConnect())
afterAll(() => dbDisconnect())
afterEach(() => Promise.all([user.deleteMany({}), item.deleteMany({})]))

test('throws error when not logged in', async () => {
  const variables = {id: 12345}

  const {errors} = await graphqlCall(UPDATE_ITEM_MUTATION, null, variables)

  expect(errors[0].message).toMatch(/you must be logged in to do that/i)
})

test('throws error when no updates specified', async () => {
  const createdUser = await user.create({
    ...fakeUser,
  })

  const context = {
    req: {
      userId: createdUser._id,
    },
  }

  const variables = {id: 12345}

  const {errors} = await graphqlCall(UPDATE_ITEM_MUTATION, context, variables)

  expect(errors[0].message).toMatch(/nothing to update/i)
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

  const variables = {
    id: new mongoose.Types.ObjectId().toString(),
    title: 'Hmmm',
  }

  const {errors} = await graphqlCall(UPDATE_ITEM_MUTATION, context, variables)

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

  const variables = {
    id: createdItem.id,
    title: 'Hmmm',
  }

  const {errors} = await graphqlCall(UPDATE_ITEM_MUTATION, context, variables)

  expect(errors[0].message).toMatch(/have permission to do that/i)
})

test('updates fields and returns item', async () => {
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

  const variables = {
    id: createdItem.id,
    title: 'Hmmm',
  }

  const {data} = await graphqlCall(UPDATE_ITEM_MUTATION, context, variables)

  expect(data.updateItem).toHaveProperty('_id', createdItem.id)
  expect(data.updateItem).toHaveProperty('title', variables.title)
  expect(data.updateItem).toHaveProperty('description', fakeItem.description)
  expect(data.updateItem).toHaveProperty('imageUrl', fakeItem.imageUrl)
  expect(data.updateItem).toHaveProperty('price', fakeItem.price)

  const updatedItem = await item
    .findById(createdItem._id)
    .select('updatedBy')
    .lean()

  expect(updatedItem.updatedBy.toString()).toEqual(createdUser.id)
})
