import mongoose from 'mongoose'

import populateUser from '#root/utils/populateUser'

import {user} from '#root/models'
import {dbConnect, dbDisconnect} from '#root/utils/dbConnection'

beforeAll(() => dbConnect())
afterAll(() => dbDisconnect())
afterEach(() => user.deleteMany({}))

test('returns next() when no userId', () => {
  const req = {}
  const next = jest.fn()

  populateUser(req, null, next)

  expect(req).not.toHaveProperty('user')
  expect(next).toHaveBeenCalled()
})

test('throws error when failed to find user', async () => {
  const userId = new mongoose.Types.ObjectId()
  const req = {userId}

  await expect(populateUser(req, null, null)).rejects.toThrowError(
    'Unable to populate user',
  )
})

test('throws error when failed to find user', async () => {
  const fakeUser = {
    name: 'Test',
    email: 'test@test.com',
    password: 'secretPass123!',
  }

  const createdUser = await user.create(fakeUser)

  const req = {userId: createdUser._id}
  const next = jest.fn()
  const expectedUser = {
    _id: createdUser._id,
    name: fakeUser.name,
    email: fakeUser.email,
    permissions: [],
  }

  await populateUser(req, null, next)

  expect(next).toHaveBeenCalled()
  expect(req).toHaveProperty('user', expectedUser)
})
