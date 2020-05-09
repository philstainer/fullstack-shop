import bcrypt from 'bcryptjs'

import {dbConnect, dbDisconnect} from '#root/utils/dbConnection'
import graphqlCall from '#root/utils/graphqlCall'
import {user} from '#root/models'

const CHANGE_EMAIL_MUTATION = `
  mutation(
    $password: String!,
    $email: String!,
    $confirmEmail: String!
  ) {
    changeEmail(
      password: $password
      email: $email
      confirmEmail: $confirmEmail
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

test('returns error not logged in', async () => {
  const variables = {
    password: '',
    email: '',
    confirmEmail: '',
  }

  const {errors} = await graphqlCall(CHANGE_EMAIL_MUTATION, null, variables)

  expect(errors[0].message).toMatch(/you must be logged in to do that/i)
})

test('returns error when empty strings', async () => {
  const variables = {
    password: '',
    email: '',
    confirmEmail: '',
  }

  const context = {
    req: {
      userId: 'abc12345',
    },
  }

  const {errors} = await graphqlCall(CHANGE_EMAIL_MUTATION, context, variables)

  expect(errors[0].message).toMatch(/password/i)
  expect(errors[0].message).toMatch(/email/i)
})

test('returns error when email and emailPassword do not match', async () => {
  const variables = {
    password: fakeUser.password,
    email: fakeUser.email,
    confirmEmail: 'I do not match',
  }

  const context = {
    req: {
      userId: 'abc12345',
    },
  }

  const {errors} = await graphqlCall(CHANGE_EMAIL_MUTATION, context, variables)

  expect(errors[0].message).toMatch(/do not match/i)
})

test('returns error when user not found', async () => {
  const variables = {
    password: fakeUser.password,
    email: fakeUser.email,
    confirmEmail: fakeUser.email,
  }

  const context = {
    req: {
      userId: '56cb91bdc3464f14678934ca',
    },
  }

  const {errors} = await graphqlCall(CHANGE_EMAIL_MUTATION, context, variables)

  expect(errors[0].message).toMatch(/error finding details/i)
})

test('returns error when passwords do not match', async () => {
  const hashed = await bcrypt.hash(fakeUser.password, 1)

  const createdUser = await user.create({...fakeUser, password: hashed})

  const variables = {
    password: 'I dont match',
    email: fakeUser.email,
    confirmEmail: fakeUser.email,
  }

  const context = {
    req: {
      userId: createdUser._id,
    },
  }

  const {errors} = await graphqlCall(CHANGE_EMAIL_MUTATION, context, variables)

  expect(errors[0].message).toMatch(/invalid password/i)
})

test('returns status when password has been updated', async () => {
  const hashed = await bcrypt.hash(fakeUser.password, 1)

  const createdUser = await user.create({...fakeUser, password: hashed})

  const newEmail = 'updated@email.com'

  const variables = {
    password: fakeUser.password,
    email: newEmail,
    confirmEmail: newEmail,
  }

  const context = {
    req: {
      userId: createdUser._id,
    },
  }

  const {data} = await graphqlCall(CHANGE_EMAIL_MUTATION, context, variables)

  const updatedUser = await user
    .findById(createdUser._id)
    .select('email')
    .lean()

  expect(updatedUser.email).toEqual(newEmail)
  expect(data.changeEmail).toHaveProperty('status', 'Success')
})
