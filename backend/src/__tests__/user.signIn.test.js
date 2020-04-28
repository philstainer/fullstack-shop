'use strict'

import {dbConnect, dbDisconnect} from '#root/utils/dbConnection'
import graphqlCall from '#root/utils/graphqlCall'

import {user} from '#root/models'

const SIGNIN_MUTATION = `
  mutation($email: String! $password: String!) 
  { 
    signIn(email: $email password: $password) { 
      _id email 
    } 
  }
`
beforeAll(async () => await dbConnect())
afterAll(async () => await dbDisconnect())
afterEach(async () => await user.deleteMany({}))

test('returns error when user not found', async () => {
  const variables = {
    email: 'test@test.com',
    password: 'secretPass123!',
  }

  const {errors} = await graphqlCall(SIGNIN_MUTATION, null, variables)

  expect(errors).toHaveLength(1)
})

test('returns error password is invalid', async () => {
  const newUser = await user.create({
    name: 'Test',
    email: 'test@test.com',
    password: 'secretPass123!',
  })

  const variables = {
    email: 'test@test.com',
    password: 'secretPass123',
  }

  const {errors} = await graphqlCall(SIGNIN_MUTATION, null, variables)

  expect(errors).toHaveLength(1)
})

test('returns user on success', async () => {
  await user.create({
    name: 'Test',
    email: 'test@test.com',
    password: '$2a$10$a5J7LQ40zM0wq2jkcXZBgefYWQfXcEbuYmNHTlsFE7UTUMhQQr8nG',
  })

  const variables = {
    email: 'test@test.com',
    password: 'secretPass123!',
  }

  const cookie = jest.fn()

  const context = {
    req: {},
    res: {
      cookie,
    },
  }

  const {data} = await graphqlCall(SIGNIN_MUTATION, context, variables)

  expect(cookie).toHaveBeenCalled()
  expect(data.signIn).toHaveProperty('_id')
  expect(data.signIn).toHaveProperty('email', variables.email)
  expect(data.signIn).not.toHaveProperty('name')
})
