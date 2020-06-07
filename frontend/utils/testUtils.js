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
  imageUrl: 'https://localhost:3000',
  price: 9999,
  ...overrides,
})

export const fakeCartItem = overrides => ({
  _id: '12345',
  quantity: 1,
  item: fakeItem(),
  ...overrides,
})
