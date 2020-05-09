import {resolvers} from '#root/graphql/localResolvers'

const {toggleAuthModal} = resolvers.Mutation

test('toggle auth modal to open when null', () => {
  const cache = {
    readQuery: jest.fn(() => ({authModal: null})),
    writeData: jest.fn(),
  }

  toggleAuthModal(null, null, {cache})

  expect(cache.readQuery).toHaveBeenCalled()
  expect(cache.writeData).toHaveBeenCalledWith({data: {authModal: 0}})
})

test('toggle auth modal to closed when not null', () => {
  const cache = {
    readQuery: jest.fn(() => ({authModal: 0})),
    writeData: jest.fn(),
  }

  toggleAuthModal(null, null, {cache})

  expect(cache.readQuery).toHaveBeenCalled()
  expect(cache.writeData).toHaveBeenCalledWith({data: {authModal: null}})
})
