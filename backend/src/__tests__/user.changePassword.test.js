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
  password: '$2a$10$hw4J/8YsYiUCu4jEhWpxBeZP0eV4bB91svZXHh.spK7BmuPs9gRJy',
}

test('returns error not logged in', async () => {
  const variables = {
    currentPassword: fakeUser.password,
    password: 'changedPass123!!',
    confirmPassword: 'changedPass123!!',
  }

  const {errors} = await graphqlCall(CHANGE_PASSWORD_MUTATION, null, variables)

  expect(errors[0].message).toMatch(/you must be logged in to do that/i)
})

test('returns error when empty strings', async () => {
  const emptyVariables = {
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
    emptyVariables,
  )

  expect(errors[0].message).toMatch(/currentPassword/i)
  expect(errors[0].message).toMatch(/password/i)
})

test('returns error when password and confirmPassword do not match', async () => {
  const variables = {
    currentPassword: 'password',
    password: 'Password1234@',
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
  const variables = {
    currentPassword: 'password',
    password: 'Password1234@',
    confirmPassword: 'Password1234@',
  }

  const context = {
    req: {
      userId: '56cb91bdc3464f14678934ca',
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
    currentPassword: 'Password1234@@',
    password: 'ChangedPassword123@',
    confirmPassword: 'ChangedPassword123@',
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
  const createdUser = await user.create(fakeUser)

  const variables = {
    currentPassword: 'Password1234@',
    password: 'ChangedPassword123@',
    confirmPassword: 'ChangedPassword123@',
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

  expect(updatedUser.password).not.toEqual(fakeUser.password)
  expect(data.changePassword).toHaveProperty('status', 'Success')
})
