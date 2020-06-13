import {render, waitFor} from '@testing-library/react'
import {MockedProvider} from '@apollo/react-testing'
import {GraphQLError} from 'graphql'

import ORDER_QUERY from '#root/graphql/order.query'

import Order from '#root/pages/Order'
import {fakeOrder} from '#root/utils/testUtils'

const query = {id: 'order id'}

test('fetch items on mount', async () => {
  const {getByText} = render(
    <MockedProvider>
      <Order query={query} />
    </MockedProvider>,
  )

  await waitFor(() => {
    expect(getByText(/loading/i)).toBeInTheDocument()
  })
})

test('renders error on graphql error', async () => {
  const mock = {
    request: {
      query: ORDER_QUERY,
      variables: {id: query.id},
    },
    result: jest.fn(() => ({
      errors: [new GraphQLError('Error finding order...')],
    })),
  }

  const {getByText} = render(
    <MockedProvider mocks={[mock]} addTypename={false}>
      <Order query={query} />
    </MockedProvider>,
  )

  await waitFor(() => {
    expect(getByText(/error finding order/i)).toBeInTheDocument()
  })
})

test('renders order', async () => {
  const mock = {
    request: {
      query: ORDER_QUERY,
      variables: {id: query.id},
    },
    result: jest.fn(() => ({
      data: {order: fakeOrder()},
    })),
  }

  const {getByTestId} = render(
    <MockedProvider mocks={[mock]} addTypename={false}>
      <Order query={query} />
    </MockedProvider>,
  )

  await waitFor(() => {
    expect(getByTestId('order')).toMatchSnapshot()
  })
})
