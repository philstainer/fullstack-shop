import graphqlFields from 'graphql-fields'
import selectedFields from '#root/utils/selectedFields'

jest.mock('graphql-fields')

afterAll(() => {
  jest.unmock('graphql-fields')
})

test('returns _id by default and removes __typename', () => {
  graphqlFields.mockImplementationOnce(() => ({__typename: 'fake type'}))

  expect(selectedFields()).toBe('id _id')
})

test('returns selected fields', () => {
  const fields = {name: {}, email: {}}

  graphqlFields.mockImplementationOnce(() => fields)

  expect(selectedFields()).toBe('name email id _id')
})
