import {
  connect,
  closeDatabase,
  clearDatabase,
} from '#root/utils/dbConnectionTest'
import graphqlCall from '#root/utils/graphqlCall'

import {item} from '#root/models'

const ITEMS_QUERY = `
  {
    itemsConnection {
      totalCount
    }
  }
`

beforeAll(() => connect())
afterAll(() => closeDatabase())
afterEach(() => clearDatabase())

test('returns totalCount of 0', async () => {
  const {data} = await graphqlCall(ITEMS_QUERY, null, null)

  expect(data.itemsConnection).toHaveProperty('totalCount', 0)
})

test('returns totalCount of 1', async () => {
  await item.create({
    title: 'Title',
    description: 'Description',
    imageUrl: 'imageUrl',
    price: 0,
  })

  const {data} = await graphqlCall(ITEMS_QUERY, null, null)

  expect(data.itemsConnection).toHaveProperty('totalCount', 1)
})
