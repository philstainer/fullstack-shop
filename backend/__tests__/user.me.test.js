'use strict'

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

beforeAll(async () => await dbConnect())
afterAll(async () => await dbDisconnect())

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

  await user.deleteMany({})
})
