import mongoose from 'mongoose'

import {
  connect,
  closeDatabase,
  clearDatabase,
} from '#root/utils/dbConnectionTest'
import graphqlCall from '#root/utils/graphqlCall'

import {item} from '#root/models'

const ITEM_QUERY = `
  query($id: ID!) {
    item(id: $id) {
      _id
      title
      description
      imageUrl
      price
    }
  }
`

const fakeItem = {
  title: 'Title',
  description: 'Description',
  imageUrl: 'https://someurl.com',
  price: 9999,
}

beforeAll(() => connect())
afterAll(() => closeDatabase())
afterEach(() => clearDatabase())

test('returns null when no item found', async () => {
  const variables = {id: new mongoose.Types.ObjectId().toString()}

  const {data} = await graphqlCall(ITEM_QUERY, null, variables)

  expect(data.item).toBeNull()
})

test('returns items', async () => {
  const createdItem = await item.create(fakeItem)

  const variables = {id: createdItem.id}

  const {data} = await graphqlCall(ITEM_QUERY, null, variables)

  expect(data.item).toHaveProperty('_id', createdItem.id)
})
