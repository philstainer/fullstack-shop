import bcrypt from 'bcryptjs'
import mongoose from 'mongoose'

import {dbConnect, dbDisconnect} from '#root/utils/dbConnection'
import graphqlCall from '#root/utils/graphqlCall'
import {user} from '#root/models'

const CHANGE_PASSWORD_MUTATION = `
  mutation(
    $currentPassword: String!,
    $password: String!,
    $confirmPassword: String!
  ) {
    changePassword(
      currentPassword: $currentPassword
      password: $password
      confirmPassword: $confirmPassword
    ) {
      status
    }
  }
`

beforeAll(() => dbConnect())
afterAll(() => dbDisconnect())
afterEach(() => user.deleteMany({}))

const fakeUser = {
  name: 'Test',
  email: 'test@test.com',
  password: 'Password123!',
}

const newPassword = 'NewPaSSword123!'

test('returns error not logged in', async () => {
  const variables = {
    currentPassword: '',
    password: '',
    confirmPassword: '',
  }

  const {errors} = await graphqlCall(CHANGE_PASSWORD_MUTATION, null, variables)

  expect(errors[0].message).toMatch(/you must be logged in to do that/i)
})

test('returns error when empty strings', async () => {
  const variables = {
    currentPassword: '',
    password: '',
    confirmPassword: '',
  }

  const context = {
    req: {
      userId: 'abc12345',
    },
  }

  const {errors} = await graphqlCall(
    CHANGE_PASSWORD_MUTATION,
    context,
    variables,
  )

  expect(errors[0].message).toMatch(/currentPassword/i)
  expect(errors[0].message).toMatch(/password/i)
})

test('returns error when password and confirmPassword do not match', async () => {
  const variables = {
    currentPassword: fakeUser.password,
    password: newPassword,
    confirmPassword: 'I do not match',
  }

  const context = {
    req: {
      userId: 'abc12345',
    },
  }

  const {errors} = await graphqlCall(
    CHANGE_PASSWORD_MUTATION,
    context,
    variables,
  )

  expect(errors[0].message).toMatch(/do not match/i)
})

test('returns error when user not found', async () => {
  const userId = new mongoose.Types.ObjectId()

  const variables = {
    currentPassword: fakeUser.password,
    password: newPassword,
    confirmPassword: newPassword,
  }

  const context = {
    req: {
      userId,
    },
  }

  const {errors} = await graphqlCall(
    CHANGE_PASSWORD_MUTATION,
    context,
    variables,
  )

  expect(errors[0].message).toMatch(/error finding details/i)
})

test('returns error when passwords do not match', async () => {
  const createdUser = await user.create(fakeUser)

  const variables = {
    currentPassword: 'I dont match',
    password: newPassword,
    confirmPassword: newPassword,
  }

  const context = {
    req: {
      userId: createdUser._id,
    },
  }

  const {errors} = await graphqlCall(
    CHANGE_PASSWORD_MUTATION,
    context,
    variables,
  )

  expect(errors[0].message).toMatch(/invalid password/i)
})

test('returns status when password has been updated', async () => {
  const hashed = await bcrypt.hash(fakeUser.password, 1)

  const createdUser = await user.create({...fakeUser, password: hashed})

  const variables = {
    currentPassword: fakeUser.password,
    password: newPassword,
    confirmPassword: newPassword,
  }

  const context = {
    req: {
      userId: createdUser._id,
    },
  }

  const {data} = await graphqlCall(CHANGE_PASSWORD_MUTATION, context, variables)

  const updatedUser = await user
    .findById(createdUser._id)
    .select('password')
    .lean()

  expect(updatedUser.password).not.toEqual(hashed)
  expect(data.changePassword).toHaveProperty('status', 'Success')
})
