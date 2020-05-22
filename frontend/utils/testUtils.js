export const fakeUser = () => ({
  _id: '12345',
  name: 'Test Name',
  email: 'test@email.com',
  confirmed: true,
  permissions: ['USER'],
})

export const fakeItem = () => ({
  _id: '12345',
  title: 'Title',
  description: 'Description',
  imageUrl: 'https://localhost:3000',
  price: 9999,
})
