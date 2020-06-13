import {dbConnect, dbDisconnect} from '#root/utils/dbConnection'
import graphqlCall from '#root/utils/graphqlCall'
import loader from '#root/graphql/loaders'

import {user, item, cartItem} from '#root/models'

const ME_QUERY = `
  {
    me {
      _id
      name
      email
      cart {
        _id
        quantity
        item {
          _id
          title
          description
          imageUrl
          price
        }
      }
    }
  }
`

beforeAll(() => dbConnect())
afterAll(() => dbDisconnect())
afterEach(() =>
  Promise.all([
    user.deleteMany({}),
    item.deleteMany({}),
    cartItem.deleteMany({}),
  ]),
)

test('returns null when not logged in', async () => {
  const {data} = await graphqlCall(ME_QUERY, null, null)

  expect(data.me).toBeNull()
})

test('returns user details when logged in', async () => {
  const newUser = await user.create({
    name: 'Test',
    email: 'test@test.com',
    password: 'sdajnj2312',
  })

  const newItem = await item.create({
    title: 'title',
    description: 'desc',
    imageUrl: 'http://testx.com',
    price: 19,
  })

  await cartItem.create({
    quantity: 1,
    user: newUser._id,
    item: newItem._id,
  })

  const context = {
    req: {userId: newUser.id},
    res: {},
    loader,
  }

  const {data} = await graphqlCall(ME_QUERY, context, null)

  expect(data.me).toHaveProperty('_id')
  expect(data.me).toHaveProperty('name', newUser.name)
  expect(data.me).toHaveProperty('email', newUser.email)

  expect(data.me.cart).toHaveLength(1)
  expect(data.me.cart[0].item).toHaveProperty('title', newItem.title)
})
