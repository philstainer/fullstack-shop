'use strict'

import {dbConnect, dbDisconnect} from '#root/utils/dbConnection'
import graphqlCall from '#root/utils/graphqlCall'
import generateToken from '#root/utils/generateToken'
import {transport} from '#root/utils/mail'
import {user} from '#root/models'

const REQUEST_RESET_MUTATION = `
  mutation($email: String!) {
    requestReset(email: $email) {
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

test('returns error when user logged in', async () => {
  const newUser = await user.create({
    ...fakeUser,
  })

  const context = {
    req: {userId: 'abc123'},
    res: {},
  }

  const variables = {
    email: 'test@test.com',
  }

  const {errors} = await graphqlCall(REQUEST_RESET_MUTATION, context, variables)

  expect(errors[0].message).toMatch(/logged in/i)
})

test('returns error when email not valid', async () => {
  const newUser = await user.create({
    ...fakeUser,
  })

  const variables = {
    email: 'not valid email',
  }

  const {errors} = await graphqlCall(REQUEST_RESET_MUTATION, null, variables)

  expect(errors[0].message).toMatch(/email/i)
})

test('returns success status when user not found', async () => {
  const newUser = await user.create({
    ...fakeUser,
  })

  const variables = {
    email: 'some@gmail.com',
  }

  const {data} = await graphqlCall(REQUEST_RESET_MUTATION, null, variables)

  expect(data.requestReset.message).toMatch(/email sent/i)
})

test('returns status on success, update user and send email', async () => {
  const newUser = await user.create({
    ...fakeUser,
  })

  const variables = {
    email: fakeUser.email,
  }

  transport.sendMail = jest.fn()

  const {data} = await graphqlCall(REQUEST_RESET_MUTATION, null, variables)

  const updatedUser = await user
    .findById(newUser.id)
    .select('resetToken resetTokenExpiry')
    .lean()

  expect(transport.sendMail).toHaveBeenCalledWith(
    expect.objectContaining({
      subject: 'Your Password Reset Token',
      to: newUser.email,
    }),
  )

  expect(updatedUser.resetToken).toBeTruthy()
  expect(updatedUser.resetTokenExpiry).toBeTruthy()

  expect(data.requestReset.message).toMatch(/email sent/i)

  transport.sendMail.mockReset()
})
