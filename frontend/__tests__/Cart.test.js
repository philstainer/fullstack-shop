import {render, fireEvent, waitFor} from '@testing-library/react'
import {MockedProvider} from '@apollo/react-testing'
import {GraphQLError} from 'graphql'

import Cart from '#root/components/Cart'
import ME_QUERY from '#root/graphql/me.query'

import {fakeUser, fakeCartItem} from '#root/utils/testUtils'

test('should fetch cart on mount and have loading status', async () => {
  const me = {
    request: {query: ME_QUERY},
    result: jest.fn(() => ({data: {me: fakeUser()}})),
  }

  const {getByText} = render(
    <MockedProvider mocks={[me]} addTypename={false}>
      <Cart />
    </MockedProvider>,
  )

  expect(getByText(/loading/i)).toBeInTheDocument()

  await waitFor(() => {
    expect(me.result).toHaveBeenCalled()
  })
})

test('should show fetch cart error', async () => {
  const me = {
    request: {query: ME_QUERY},
    result: jest.fn(() => ({errors: [new GraphQLError()]})),
  }

  const {getByText} = render(
    <MockedProvider mocks={[me]} addTypename={false}>
      <Cart />
    </MockedProvider>,
  )

  await waitFor(() => {
    expect(getByText(/failed to load cart/i)).toBeInTheDocument()
  })
})

test('should return null when not logged in', async () => {
  const me = {
    request: {query: ME_QUERY},
    result: jest.fn(() => ({
      data: {
        me: null,
      },
    })),
  }

  const {container} = render(
    <MockedProvider mocks={[me]} addTypename={false}>
      <Cart />
    </MockedProvider>,
  )

  await waitFor(() => {
    expect(container).toBeEmptyDOMElement()
  })
})

test('should show cart with quantity count', async () => {
  const quantity = 1

  const me = {
    request: {query: ME_QUERY},
    result: jest.fn(() => ({
      data: {
        me: fakeUser({cart: [fakeCartItem({quantity})]}),
      },
    })),
  }

  const {getByTestId} = render(
    <MockedProvider mocks={[me]} addTypename={false}>
      <Cart />
    </MockedProvider>,
  )

  await waitFor(() => {
    expect(getByTestId('count')).toHaveTextContent(quantity)
  })
})

test('toggles cartOpen onClick', async () => {
  const localResolvers = {
    Mutation: {
      toggleCart: jest.fn(),
    },
  }

  const me = {
    request: {query: ME_QUERY},
    result: jest.fn(() => ({
      data: {me: fakeUser()},
    })),
  }

  const {getByTestId} = render(
    <MockedProvider mocks={[me]} addTypename={false} resolvers={localResolvers}>
      <Cart />
    </MockedProvider>,
  )

  await waitFor(() => {
    expect(getByTestId('cart')).toBeInTheDocument()
  })

  fireEvent.click(getByTestId('cart'))

  await waitFor(() => {
    expect(localResolvers.Mutation.toggleCart).toHaveBeenCalled()
  })
})
