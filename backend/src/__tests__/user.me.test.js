import {dbConnect, dbDisconnect} from '#root/utils/dbConnection'
import graphqlCall from '#root/utils/graphqlCall'

import {user} from '#root/models'

const ME_QUERY = `
  {
    me {
      _id
      name
      email
    }
  }
`

beforeAll(() => dbConnect())
afterAll(() => dbDisconnect())
afterEach(() => user.deleteMany({}))

test('returns null when not logged in', async () => {
  const {data} = await graphqlCall(ME_QUERY, null, null)

  expect(data.me).toBeNull()
})

test('clear cookie when user not found', async () => {
  const context = {
    req: {userId: '56cb91bdc3464f14678934ca'},
    res: {clearCookie: jest.fn()},
  }

  const {data} = await graphqlCall(ME_QUERY, context, null)

  expect(context.res.clearCookie).toHaveBeenCalled()
  expect(data.me).toBeNull()
})

test('returns user details when logged in', async () => {
  const newUser = await user.create({
    name: 'Test',
    email: 'test@test.com',
    password: 'sdajnj2312',
  })

  const context = {
    req: {userId: newUser.id},
    res: {},
  }

  const {data} = await graphqlCall(ME_QUERY, context, null)

  expect(data.me).toHaveProperty('_id')
  expect(data.me).toHaveProperty('name', newUser.name)
  expect(data.me).toHaveProperty('email', newUser.email)
})
