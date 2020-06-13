import mongoose from 'mongoose'

import {dbConnect, dbDisconnect} from '#root/utils/dbConnection'
import loader from '#root/graphql/loaders/user'

import {user} from '#root/models'

beforeAll(() => dbConnect())
afterAll(() => dbDisconnect())
afterEach(() => user.deleteMany({}))

test('returns null if not found', async () => {
  const data = await loader.users.load(new mongoose.Types.ObjectId())

  expect(data).toBeNull()
})

test('returns users', async () => {
  const newUser = await user.create({
    name: 'Test',
    email: 'test@test.com',
    password: 'sdajnj2312',
  })

  const data = await loader.users.load(newUser._id)

  expect(data).toHaveProperty('name', newUser.name)
})
