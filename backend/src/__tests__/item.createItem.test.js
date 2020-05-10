import {dbConnect, dbDisconnect} from '#root/utils/dbConnection'
import graphqlCall from '#root/utils/graphqlCall'

import {user} from '#root/models'

const CREATE_ITEM_MUTATION = `
  mutation(
    $title: String!
    $description: String!
    $imageUrl: String!
    $price: Int!
  ) {
    createItem(
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

beforeAll(() => dbConnect())
afterAll(() => dbDisconnect())
afterEach(() => user.deleteMany({}))

const fakeUser = {
  name: 'Test',
  email: 'test@test.com',
  password: 'secretPass123!',
}

test('throws error when not logged in', async () => {
  const variables = {
    title: '',
    description: '',
    imageUrl: '',
    price: 1,
  }

  const {errors} = await graphqlCall(CREATE_ITEM_MUTATION, null, variables)

  expect(errors[0].message).toMatch(/you must be logged in to do that/i)
})

test('throws error when authorization fails', async () => {
  const createdUser = await user.create({
    ...fakeUser,
  })

  const variables = {
    title: '',
    description: '',
    imageUrl: '',
    price: 1,
  }

  const context = {
    req: {
      userId: createdUser._id,
    },
  }

  const {errors} = await graphqlCall(CREATE_ITEM_MUTATION, context, variables)

  expect(errors[0].message).toMatch(/sufficient permissions/i)
})

test('throws error on invalid validation', async () => {
  const createdUser = await user.create({
    ...fakeUser,
    permissions: ['ITEMCREATE'],
  })

  const variables = {
    title: '',
    description: '',
    imageUrl: 'not a url',
    price: 0,
  }

  const context = {
    req: {
      userId: createdUser._id,
      user: createdUser,
    },
  }

  const {errors} = await graphqlCall(CREATE_ITEM_MUTATION, context, variables)

  expect(errors[0].message).toMatch(/title/i)
  expect(errors[0].message).toMatch(/description/i)
  expect(errors[0].message).toMatch(/imageUrl/i)
})

test('returns createdItem on success', async () => {
  const createdUser = await user.create({
    ...fakeUser,
    permissions: ['ADMIN'],
  })

  const variables = {
    title: 'Title',
    description: 'Description',
    imageUrl: 'https://someurl.com',
    price: 9999,
  }

  const context = {
    req: {
      userId: createdUser._id,
      user: createdUser,
    },
  }

  const {data, errors} = await graphqlCall(
    CREATE_ITEM_MUTATION,
    context,
    variables,
  )

  expect(data.createItem).toHaveProperty('_id')
  expect(data.createItem).toHaveProperty('title', variables.title)
  expect(data.createItem).toHaveProperty('description', variables.description)
  expect(data.createItem).toHaveProperty('imageUrl', variables.imageUrl)
  expect(data.createItem).toHaveProperty('price', variables.price)
})
