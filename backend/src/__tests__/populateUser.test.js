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
  const res = {clearCookie: jest.fn()}
  const next = jest.fn()

  await populateUser(req, res, next)

  expect(next).toHaveBeenCalled()
  expect(res.clearCookie).toHaveBeenCalled()
})

test('populates req.user with user', async () => {
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
    confirmed: false,
    permissions: ['USER'],
  }

  await populateUser(req, null, next)

  expect(next).toHaveBeenCalled()
  expect(req).toHaveProperty('user', expectedUser)
})
