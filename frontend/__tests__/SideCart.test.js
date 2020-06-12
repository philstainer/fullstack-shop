import {render, fireEvent, waitFor} from '@testing-library/react'
import {MockedProvider} from '@apollo/react-testing'
import {GraphQLError} from 'graphql'
import {InMemoryCache} from 'apollo-cache-inmemory'

import ME_QUERY from '#root/graphql/me.query'
import REMOVE_CART_ITEM_MUTATION from '#root/graphql/removeCartItem.mutation'

import SideCart from '#root/components/SideCart'
import formatPrice from '#root/utils/formatPrice'
import calcTotalPrice from '#root/utils/calcTotalPrice'
import {fakeUser, fakeCartItem} from '#root/utils/testUtils'

test('returns null when fetch loading', async () => {
  const cache = new InMemoryCache({addTypename: false})

  cache.writeData({data: {cartOpen: false}})

  const me = {
    request: {query: ME_QUERY},
    result: jest.fn(() => ({data: {me: fakeUser()}})),
  }

  const {container} = render(
    <MockedProvider
      mocks={[me]}
      addTypename={false}
      cache={cache}
      resolvers={{}}
    >
      <SideCart />
    </MockedProvider>,
  )

  expect(container).toBeEmptyDOMElement()

  await waitFor(() => {
    expect(me.result).toHaveBeenCalled()
  })
})

test('returns null when fetch error', async () => {
  const cache = new InMemoryCache({addTypename: false})

  cache.writeData({data: {cartOpen: false}})

  const me = {
    request: {query: ME_QUERY},
    result: jest.fn(() => ({errors: [new GraphQLError()]})),
  }

  const {container} = render(
    <MockedProvider
      mocks={[me]}
      addTypename={false}
      cache={cache}
      resolvers={{}}
    >
      <SideCart />
    </MockedProvider>,
  )

  expect(container).toBeEmptyDOMElement()

  await waitFor(() => {
    expect(me.result).toHaveBeenCalled()
  })
})

test('side bar off screen when cartOpen false', async () => {
  const cache = new InMemoryCache({addTypename: false})

  cache.writeData({data: {cartOpen: false}})

  const me = {
    request: {query: ME_QUERY},
    result: jest.fn(() => ({data: {me: fakeUser()}})),
  }

  const {queryByTestId} = render(
    <MockedProvider
      mocks={[me]}
      addTypename={false}
      cache={cache}
      resolvers={{}}
    >
      <SideCart />
    </MockedProvider>,
  )

  await waitFor(() => {
    expect(queryByTestId('cart')).toBeInTheDocument()
    expect(queryByTestId('cart')).toHaveStyle('transform: translateX(100%)')
  })
})

test('side bar on screen when cartOpen true', async () => {
  const cache = new InMemoryCache({addTypename: false})

  cache.writeData({data: {cartOpen: true}})

  const me = {
    request: {query: ME_QUERY},
    result: jest.fn(() => ({data: {me: fakeUser()}})),
  }

  const {queryByTestId} = render(
    <MockedProvider
      mocks={[me]}
      addTypename={false}
      cache={cache}
      resolvers={{}}
    >
      <SideCart />
    </MockedProvider>,
  )

  await waitFor(() => {
    expect(queryByTestId('cart')).toBeInTheDocument()
    expect(queryByTestId('cart')).toHaveStyle('transform: translateX(0)')
  })
})

test('close button toggles cartOpen', async () => {
  const cache = new InMemoryCache({addTypename: false})

  cache.writeData({data: {cartOpen: true}})

  const resolvers = {
    Mutation: {
      toggleCart: jest.fn(),
    },
  }

  const me = {
    request: {query: ME_QUERY},
    result: jest.fn(() => ({data: {me: fakeUser()}})),
  }

  const {queryByTestId} = render(
    <MockedProvider
      mocks={[me]}
      addTypename={false}
      cache={cache}
      resolvers={resolvers}
    >
      <SideCart />
    </MockedProvider>,
  )

  await waitFor(() => {
    expect(queryByTestId('cart')).toBeInTheDocument()

    fireEvent.click(queryByTestId('close'))

    expect(resolvers.Mutation.toggleCart).toHaveBeenCalled()
  })
})

test('renders removed item text when item is null', async () => {
  const cache = new InMemoryCache({addTypename: false})

  cache.writeData({data: {cartOpen: true}})

  const meMock = {
    request: {query: ME_QUERY},
    result: jest.fn(() => ({
      data: {me: fakeUser({cart: [fakeCartItem({item: null})]})},
    })),
  }

  const {queryByTestId, queryByText} = render(
    <MockedProvider
      mocks={[meMock]}
      addTypename={false}
      cache={cache}
      resolvers={{}}
    >
      <SideCart />
    </MockedProvider>,
  )

  await waitFor(() => {
    expect(queryByTestId('cart')).toBeInTheDocument()

    expect(queryByText(/this item has been removed/i)).toBeInTheDocument()
  })
})

test('renders side cart', async () => {
  const cache = new InMemoryCache({addTypename: false})

  cache.writeData({data: {cartOpen: true}})

  const me = fakeUser({cart: [fakeCartItem()]})

  const meMock = {
    request: {query: ME_QUERY},
    result: jest.fn(() => ({
      data: {me},
    })),
  }

  const {queryByTestId, queryByText} = render(
    <MockedProvider
      mocks={[meMock]}
      addTypename={false}
      cache={cache}
      resolvers={{}}
    >
      <SideCart />
    </MockedProvider>,
  )

  await waitFor(() => {
    // Cart
    expect(queryByTestId('cart')).toBeInTheDocument()

    // Name
    expect(queryByText(`${me.name}'s Cart`)).toBeInTheDocument()

    // Items text
    expect(
      queryByText(`Total of ${me.cart.length} Item in your cart.`),
    ).toBeInTheDocument()

    // Items
    expect(queryByTestId('img')).toHaveProperty('src', me.cart[0].item.imageUrl)
    expect(queryByTestId('title')).toHaveTextContent(me.cart[0].item.title)
    expect(queryByTestId('removeCartItem')).toBeInTheDocument()

    // Total Price
    expect(
      queryByText(formatPrice(calcTotalPrice(me.cart))),
    ).toBeInTheDocument()

    // Button
    expect(queryByText(/checkout/i)).toBeInTheDocument()
  })
})

test('button onClick removes cartItem from cart', async () => {
  const cache = new InMemoryCache({addTypename: false})

  cache.writeData({data: {cartOpen: true}})

  const meMock = {
    request: {query: ME_QUERY},
    result: jest.fn(() => ({
      data: {me: fakeUser({cart: [fakeCartItem()]})},
    })),
  }

  const removeMock = {
    request: {
      query: REMOVE_CART_ITEM_MUTATION,
      variables: {id: fakeCartItem()._id},
    },
    result: jest.fn(() => ({
      data: {removeFromCart: {_id: fakeCartItem()._id}},
    })),
  }

  const {queryByTestId} = render(
    <MockedProvider
      mocks={[meMock, removeMock]}
      addTypename={false}
      cache={cache}
      resolvers={{}}
    >
      <SideCart />
    </MockedProvider>,
  )

  await waitFor(() => {
    expect(queryByTestId('cart')).toBeInTheDocument()
  })

  fireEvent.click(queryByTestId('removeCartItem'))

  await waitFor(() => {
    expect(removeMock.result).toHaveBeenCalled()

    const updatedCache = cache.readQuery({
      query: ME_QUERY,
    })

    expect(updatedCache.me.cart).toHaveLength(0)
  })
})
