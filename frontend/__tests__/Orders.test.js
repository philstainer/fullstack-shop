import {render, waitFor} from '@testing-library/react'
import {MockedProvider} from '@apollo/react-testing'
import {GraphQLError} from 'graphql'

import ORDERS_QUERY from '#root/graphql/orders.query'

import Orders from '#root/components/Orders'
import {fakeOrder} from '#root/utils/testUtils'

const query = {id: 'order id'}

test('fetch items on mount', async () => {
  const {getByText} = render(
    <MockedProvider>
      <Orders />
    </MockedProvider>,
  )

  await waitFor(() => {
    expect(getByText(/loading orders/i)).toBeInTheDocument()
  })
})

test('renders error on graphql error', async () => {
  const mock = {
    request: {query: ORDERS_QUERY},
    result: jest.fn(() => ({
      errors: [new GraphQLError('Error finding orders...')],
    })),
  }

  const {getByText} = render(
    <MockedProvider mocks={[mock]} addTypename={false}>
      <Orders />
    </MockedProvider>,
  )

  await waitFor(() => {
    expect(getByText(/error finding orders/i)).toBeInTheDocument()
  })
})

test('renders orders', async () => {
  const mock = {
    request: {query: ORDERS_QUERY},
    result: jest.fn(() => ({data: {orders: [fakeOrder()]}})),
  }

  const {container} = render(
    <MockedProvider mocks={[mock]} addTypename={false}>
      <Orders />
    </MockedProvider>,
  )

  await waitFor(() => {
    expect(container).toMatchSnapshot()
  })
})
