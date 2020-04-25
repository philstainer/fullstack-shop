'use strict'

import {dbConnect, dbDisconnect} from '#root/utils/dbConnection'
import graphqlCall from '#root/utils/graphqlCall'

import {user} from '#root/models'

const SIGNUP_MUTATION = `
  mutation(
    $name: String!
    $email: String!
    $password: String!
    $confirmPassword: String!
  ) {
    signUp(
      name: $name
      email: $email
      password: $password
      confirmPassword: $confirmPassword
    ) {
      _id
      name
    }
  }
`

beforeAll(async () => await dbConnect())
afterAll(async () => await dbDisconnect())

test('throws error if already logged in', async () => {
  const variables = {
    name: 'Test User',
    email: 'test@gmail.com',
    password: 'secretPass123!',
    confirmPassword: 'secretPass123!',
  }

  const context = {req: {userId: 123}}

  const result = await graphqlCall(SIGNUP_MUTATION, context, variables)

  expect(result.errors[0].message).toMatch(/already logged in/i)
})

test('throws validation error when it fails to validate input', async () => {
  const variables = {
    name: 'Tes',
    email: 'test@gmail',
    password: 'secretPass1',
    confirmPassword: 'secretPass123!',
  }

  const context = {req: {}}

  const result = await graphqlCall(SIGNUP_MUTATION, context, variables)

  expect(result.errors[0].message).toMatch(/email/i)
  expect(result.errors[0].message).toMatch(/password/i)
  expect(result.errors[0].message).toMatch(/confirm password/i)
})

test('successfully signs up when validate', async () => {
  const variables = {
    name: 'Test User',
    email: 'test@gmail.com',
    password: 'secretPass123!',
    confirmPassword: 'secretPass123!',
  }

  const cookie = jest.fn()

  const context = {
    req: {},
    res: {
      cookie,
    },
  }

  const result = await graphqlCall(SIGNUP_MUTATION, context, variables)

  expect(cookie).toHaveBeenCalled()
  expect(result.data.signUp._id).toBeTruthy()
  expect(result.data.signUp.name).toBe(variables.name)

  await user.deleteMany({})
})
