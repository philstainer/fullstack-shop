'use strict'

import {dbConnect, dbDisconnect} from '#root/utils/dbConnection'
import graphqlCall from '#root/utils/graphqlCall'
import generateToken from '#root/utils/generateToken'
import {user} from '#root/models'

const CONFIRMACCOUNT_MUTATION = `
  mutation(
    $confirmToken: String!
  ) {
    confirmAccount(
      confirmToken: $confirmToken
    ) {
      status
      message
    }
  }
`

beforeAll(async () => await dbConnect())
afterAll(async () => await dbDisconnect())
afterEach(async () => await user.deleteMany({}))

const fakeUser = {
  name: 'Test',
  email: 'test@test.com',
  password: 'secretPass123!',
}

test('returns error when user token not found', async () => {
  const token = await generateToken()

  const newUser = await user.create({
    ...fakeUser,
    confirmToken: 'token-wont-match',
    confirmTokenExpiry: Date.now() + 1 * 60 * 60 * 1000,
  })

  const variables = {
    confirmToken: token,
  }

  const {errors} = await graphqlCall(CONFIRMACCOUNT_MUTATION, null, variables)

  expect(errors).toHaveLength(1)
})

test('returns error when user token has expired', async () => {
  const token = await generateToken()

  const newUser = await user.create({
    ...fakeUser,
    confirmToken: token,
    confirmTokenExpiry: Date.now() - 1 * 60 * 60 * 1000,
  })

  const variables = {
    confirmToken: token,
  }

  const {errors} = await graphqlCall(CONFIRMACCOUNT_MUTATION, null, variables)

  expect(errors).toHaveLength(1)
})

test('returns message on success', async () => {
  const token = await generateToken()

  const newUser = await user.create({
    ...fakeUser,
    confirmToken: token,
    confirmTokenExpiry: Date.now() + 1 * 60 * 60 * 1000,
  })

  const variables = {
    confirmToken: token,
  }

  const {data} = await graphqlCall(CONFIRMACCOUNT_MUTATION, null, variables)

  expect(data.confirmAccount).toHaveProperty(
    'status',
    expect.stringMatching(/success/i),
  )

  expect(data.confirmAccount).toHaveProperty(
    'message',
    expect.stringMatching(/account has now been confirmed/i),
  )
})