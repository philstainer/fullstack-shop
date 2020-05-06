import {dbConnect, dbDisconnect} from '#root/utils/dbConnection'
import graphqlCall from '#root/utils/graphqlCall'
import generateToken from '#root/utils/generateToken'
import {user} from '#root/models'

const RESET_PASSWORD_MUTATION = `
  mutation(
    $resetToken: String!
    $password: String!
    $confirmPassword: String!
  ) {
    resetPassword(
      resetToken: $resetToken
      password: $password
      confirmPassword: $confirmPassword
    ) {
      email
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

test('returns error when it fails to validate input', async () => {
  const variables = {
    resetToken: 'token',
    password: 'password',
    confirmPassword: 'confirm password',
  }

  const {errors} = await graphqlCall(RESET_PASSWORD_MUTATION, null, variables)

  expect(errors[0].message).toMatch(/resetToken/i)
  expect(errors[0].message).toMatch(/password/i)
  expect(errors[0].message).toMatch(/confirm password/i)
})

test('returns error when token expired or invalid', async () => {
  const resetToken = await generateToken()

  await user.create({
    ...fakeUser,
    resetToken,
    resetTokenExpiry: Date.now() - 15 * 60 * 1000,
  })

  const variables = {
    resetToken: '3252334',
    password: 'Password123!',
    confirmPassword: 'Password123!',
  }

  const {errors} = await graphqlCall(RESET_PASSWORD_MUTATION, null, variables)

  expect(errors[0].message).toMatch(/invalid or expired/i)
})

test('returns user on success, updates passwords and resets fields', async () => {
  const resetToken = await generateToken()

  const newUser = await user.create({
    ...fakeUser,
    resetToken,
    resetTokenExpiry: Date.now() + 15 * 60 * 1000,
  })

  const variables = {
    resetToken,
    password: 'Password123!',
    confirmPassword: 'Password123!',
  }

  const cookie = jest.fn()

  const context = {
    req: {},
    res: {
      cookie,
    },
  }

  const {data} = await graphqlCall(RESET_PASSWORD_MUTATION, context, variables)

  const updatedUser = await user
    .findById(newUser.id)
    .select('password resetToken resetTokenExpiry')
    .lean()

  expect(updatedUser.password).not.toEqual(fakeUser.password)
  expect(updatedUser.resetToken).toBeNull()
  expect(updatedUser.resetTokenExpiry).toBeNull()

  expect(cookie).toHaveBeenCalled()

  expect(data.resetPassword).toHaveProperty('email', fakeUser.email)
})
