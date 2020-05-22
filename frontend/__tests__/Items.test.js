import {render, fireEvent, waitFor} from '@testing-library/react'
import {MockedProvider} from '@apollo/react-testing'
import {GraphQLError} from 'graphql'

import Items from '#root/pages/index'
import ITEMS_QUERY from '#root/graphql/items.query'
import ME_QUERY from '#root/graphql/me.query'
import {fakeUser, fakeItem} from '#root/utils/testUtils'

const perPage = 4

test('fetch items on mount', async () => {
  const {getByText} = render(
    <MockedProvider>
      <Items />
    </MockedProvider>,
  )

  await waitFor(() => {
    expect(getByText(/loading/i)).toBeInTheDocument()
  })
})

test('renders error on graphql error', async () => {
  const mock = {
    request: {
      query: ITEMS_QUERY,
      variables: {skip: 1 * perPage - perPage},
    },
    result: jest.fn(() => ({
      errors: [new GraphQLError('Error finding items...')],
    })),
  }

  const {getByText} = render(
    <MockedProvider mocks={[mock]}>
      <Items />
    </MockedProvider>,
  )

  await waitFor(() => {
    expect(getByText(/error/i)).toBeInTheDocument()
    expect(getByText(/error finding items/i)).toBeInTheDocument()
  })
})

test('renders items', async () => {
  const items = {
    request: {
      query: ITEMS_QUERY,
      variables: {skip: 1 * perPage - perPage},
    },
    result: jest.fn(() => ({
      data: {items: [fakeItem()]},
    })),
  }

  const me = {
    request: {query: ME_QUERY},
    result: jest.fn(() => ({data: {me: fakeUser()}})),
  }

  const {queryByText, getByText} = render(
    <MockedProvider mocks={[items, me]} addTypename={false}>
      <Items />
    </MockedProvider>,
  )

  await waitFor(() => {
    expect(queryByText(/loading/i)).not.toBeInTheDocument()
    expect(queryByText(/error/i)).not.toBeInTheDocument()
    expect(getByText(fakeItem().title)).toBeInTheDocument()
  })
})

test('renders only add to cart for user permission', async () => {
  const items = {
    request: {
      query: ITEMS_QUERY,
      variables: {skip: 1 * perPage - perPage},
    },
    result: jest.fn(() => ({
      data: {items: [fakeItem()]},
    })),
  }

  const me = {
    request: {query: ME_QUERY},
    result: jest.fn(() => ({data: {me: fakeUser()}})),
  }

  const {queryByText, getByText} = render(
    <MockedProvider mocks={[items, me]} addTypename={false}>
      <Items />
    </MockedProvider>,
  )

  await waitFor(() => {
    expect(queryByText(/edit/i)).not.toBeInTheDocument()
    expect(queryByText(/delete this item/i)).not.toBeInTheDocument()
    expect(getByText(/add to cart/i)).toBeInTheDocument()
  })
})

test('renders edit button for admin and item update permissions', async () => {
  const items = {
    request: {
      query: ITEMS_QUERY,
      variables: {skip: 1 * perPage - perPage},
    },
    result: jest.fn(() => ({
      data: {items: [fakeItem()]},
    })),
  }

  const me = {
    request: {query: ME_QUERY},
    result: jest.fn(() => ({
      data: {
        me: {
          ...fakeUser(),
          permissions: ['ADMIN', 'ITEMUPDATE'],
        },
      },
    })),
  }

  const {getByText} = render(
    <MockedProvider mocks={[items, me]} addTypename={false}>
      <Items />
    </MockedProvider>,
  )

  await waitFor(() => {
    expect(getByText(/edit/i)).toBeInTheDocument()
  })
})

test('renders delete button for admin and item delete permissions', async () => {
  const items = {
    request: {
      query: ITEMS_QUERY,
      variables: {skip: 1 * perPage - perPage},
    },
    result: jest.fn(() => ({
      data: {items: [fakeItem()]},
    })),
  }

  const me = {
    request: {query: ME_QUERY},
    result: jest.fn(() => ({
      data: {
        me: {
          ...fakeUser(),
          permissions: ['ADMIN', 'ITEMDELETE'],
        },
      },
    })),
  }

  const {getByText} = render(
    <MockedProvider mocks={[items, me]} addTypename={false}>
      <Items />
    </MockedProvider>,
  )

  await waitFor(() => {
    expect(getByText(/delete this item/i)).toBeInTheDocument()
  })
})
