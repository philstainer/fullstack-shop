export const fakeUser = overrides => ({
  _id: '12345',
  name: 'Test Name',
  email: 'test@email.com',
  confirmed: true,
  permissions: ['USER'],
  cart: [],
  ...overrides,
})

export const fakeItem = overrides => ({
  _id: '12345',
  title: 'Title',
  description: 'Description',
  imageUrl: 'https://localhost:3000/',
  price: 9999,
  ...overrides,
})

export const fakeCartItem = overrides => ({
  _id: '12345',
  quantity: 1,
  item: fakeItem(),
  ...overrides,
})

export const fakeOrderItem = overrides => ({
  _id: '12345',
  title: 'Title',
  description: 'Description',
  imageUrl: 'https://localhost:3000/',
  price: 9999,
  quantity: 1,
  ...overrides,
})

export const fakeOrder = overrides => ({
  _id: '12345',
  charge: 'ch_12345',
  total: 5000,
  items: [fakeOrderItem(), fakeOrderItem()],
  createdAt: '2018-04-06T19:24:16.000Z',
  user: fakeUser(),
  ...overrides,
})
