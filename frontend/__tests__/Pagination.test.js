import {render, waitFor} from '@testing-library/react'
import {MockedProvider} from '@apollo/react-testing'
import {GraphQLError} from 'graphql'

import Pagination from '#root/components/Pagination'
import ITEMS_CONNECTION_QUERY from '#root/graphql/itemsConnection.query'

test('renders with initial state of loading', async () => {
  const itemsConnection = {
    request: {
      query: ITEMS_CONNECTION_QUERY,
    },
    result: jest.fn(() => ({
      data: {itemsConnection: {totalCount: 1}},
    })),
  }

  const {getByText} = render(
    <MockedProvider mocks={[itemsConnection]} addTypename={false}>
      <Pagination page={1} />
    </MockedProvider>,
  )

  expect(getByText(/loading/i)).toBeInTheDocument()
})

test('render errors', async () => {
  const itemsConnection = {
    request: {
      query: ITEMS_CONNECTION_QUERY,
    },
    result: jest.fn(() => ({
      errors: [new GraphQLError('Error loading item total...')],
    })),
  }

  const {getByText} = render(
    <MockedProvider mocks={[itemsConnection]} addTypename={false}>
      <Pagination page={1} />
    </MockedProvider>,
  )

  await waitFor(() => {
    expect(getByText(/error loading/i)).toBeInTheDocument()
  })
})

test('prev and next buttons disabled on 1 page', async () => {
  const itemsConnection = {
    request: {
      query: ITEMS_CONNECTION_QUERY,
    },
    result: jest.fn(() => ({
      data: {itemsConnection: {totalCount: 1}},
    })),
  }

  const {getByTestId} = render(
    <MockedProvider mocks={[itemsConnection]} addTypename={false}>
      <Pagination page={1} />
    </MockedProvider>,
  )

  await waitFor(() => {
    expect(getByTestId('pagination')).toMatchSnapshot()
  })
})

test('prev and next buttons enabled with items', async () => {
  const itemsConnection = {
    request: {
      query: ITEMS_CONNECTION_QUERY,
    },
    result: jest.fn(() => ({
      data: {itemsConnection: {totalCount: 20}},
    })),
  }

  const {getByTestId} = render(
    <MockedProvider mocks={[itemsConnection]} addTypename={false}>
      <Pagination page={2} />
    </MockedProvider>,
  )

  await waitFor(() => {
    expect(getByTestId('pagination')).toMatchSnapshot()
  })
})
