import {dbConnect, dbDisconnect} from '#root/utils/dbConnection'
import graphqlCall from '#root/utils/graphqlCall'

import {user, item} from '#root/models'

const ITEMS_QUERY = `
  query($limit: Int, $skip: Int) {
    items(limit: $limit, skip: $skip) {
      _id
      title
      description
      createdBy {
        _id
      }
    }
  }
`

beforeAll(async () => {
  await dbConnect()

  const createdUser = await user.create({
    name: 'Test User',
    email: 'test@test.com',
    password: '12345',
  })

  const items = [
    {
      title: 'Item 1',
      description: 'description',
      imageUrl: 'imageUrl',
      price: 0,
      createdBy: createdUser._id,
    },
    {
      title: 'Item 2',
      description: 'description',
      imageUrl: 'imageUrl',
      price: 0,
      createdBy: createdUser._id,
    },
    {
      title: 'Item 3',
      description: 'description',
      imageUrl: 'imageUrl',
      price: 0,
      createdBy: createdUser._id,
    },
    {
      title: 'Item 4',
      description: 'description',
      imageUrl: 'imageUrl',
      price: 0,
      createdBy: createdUser._id,
    },
    {
      title: 'Item 5',
      description: 'description',
      imageUrl: 'imageUrl',
      price: 0,
      createdBy: createdUser._id,
    },
    {
      title: 'Item 6',
      description: 'description',
      imageUrl: 'imageUrl',
      price: 0,
      createdBy: createdUser._id,
    },
    {
      title: 'Item 7',
      description: 'description',
      imageUrl: 'imageUrl',
      price: 0,
      createdBy: createdUser._id,
    },
    {
      title: 'Item 8',
      description: 'description',
      imageUrl: 'imageUrl',
      price: 0,
      createdBy: createdUser._id,
    },
    {
      title: 'Item 9',
      description: 'description',
      imageUrl: 'imageUrl',
      price: 0,
      createdBy: createdUser._id,
    },
    {
      title: 'Item 10',
      description: 'description',
      imageUrl: 'imageUrl',
      price: 0,
      createdBy: createdUser._id,
    },
    {
      title: 'Item 11',
      description: 'description',
      imageUrl: 'imageUrl',
      price: 0,
      createdBy: createdUser._id,
    },
  ]

  await item.insertMany(items)
})

afterAll(async () => {
  await Promise.all([user.deleteMany({}), item.deleteMany({})])

  await dbDisconnect()
})

test('returns data with defaults', async () => {
  const {data} = await graphqlCall(ITEMS_QUERY, null, null)

  expect(data.items).toHaveLength(10)
})

test('return items with limit', async () => {
  const variables = {
    limit: 1,
  }

  const {data} = await graphqlCall(ITEMS_QUERY, null, variables)

  expect(data.items).toHaveLength(1)
})

test('return items with skip', async () => {
  const variables = {
    skip: 6,
  }

  const {data} = await graphqlCall(ITEMS_QUERY, null, variables)

  expect(data.items).toHaveLength(5)
})
