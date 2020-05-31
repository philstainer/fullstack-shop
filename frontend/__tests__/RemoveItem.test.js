import {render, fireEvent, waitFor} from '@testing-library/react'
import {MockedProvider} from '@apollo/react-testing'
import {InMemoryCache} from 'apollo-cache-inmemory'

import RemoveItem from '#root/components/RemoveItem'
import {fakeUser, fakeItem} from '#root/utils/testUtils'

import DELETE_ITEM_MUTATION from '#root/graphql/deleteItem.mutation'
import ITEMS_QUERY from '#root/graphql/items.query'
import ME_QUERY from '#root/graphql/me.query'
import ITEMS_CONNECTION_QUERY from '#root/graphql/itemsConnection.query'

test('returns null when user does not have permission', async () => {
  const me = {
    request: {query: ME_QUERY},
    result: jest.fn(() => ({data: {me: fakeUser()}})),
  }

  const {queryByText} = render(
    <MockedProvider mocks={[me]} addTypename={false}>
      <RemoveItem id="12345" skip={0} />
    </MockedProvider>,
  )

  await waitFor(() => {
    expect(me.result).toHaveBeenCalled()

    expect(queryByText(/delete this item/i)).not.toBeInTheDocument()
  })
})

test('returns null when confirm is cancelled', async () => {
  window.confirm = jest.fn(() => false)

  const me = {
    request: {query: ME_QUERY},
    result: jest.fn(() => ({
      data: {me: {...fakeUser(), permissions: ['ADMIN']}},
    })),
  }

  const {queryByText} = render(
    <MockedProvider mocks={[me]} addTypename={false}>
      <RemoveItem id="12345" skip={0} />
    </MockedProvider>,
  )

  await waitFor(() => {
    expect(me.result).toHaveBeenCalled()

    expect(queryByText(/delete this item/i)).toBeInTheDocument()
  })

  fireEvent.click(queryByText(/delete this item/i))

  expect(window.confirm).toHaveReturnedWith(false)
})

test('renders button and delete items on click', async () => {
  window.confirm = jest.fn(() => true)

  const me = {
    request: {query: ME_QUERY},
    result: jest.fn(() => ({
      data: {me: {...fakeUser(), permissions: ['ADMIN']}},
    })),
  }

  const deleteItem = {
    request: {query: DELETE_ITEM_MUTATION, variables: {id: '12345'}},
    result: jest.fn(() => ({
      data: {deleteItem: fakeItem()},
    })),
  }

  const items = {
    request: {query: ITEMS_QUERY, variables: {skip: 0, limit: 4}},
    result: jest.fn(() => ({
      data: {items: [fakeItem(), {...fakeItem(), _id: 1}]},
    })),
  }

  const cache = new InMemoryCache({addTypename: false})

  const data = {
    itemsConnection: {
      totalCount: 2,
    },
  }

  cache.writeData({data})

  const {queryByText} = render(
    <MockedProvider
      mocks={[me, deleteItem, items]}
      addTypename={false}
      cache={cache}
    >
      <RemoveItem id="12345" skip={0} />
    </MockedProvider>,
  )

  await waitFor(() => {
    expect(me.result).toHaveBeenCalled()

    expect(queryByText(/delete this item/i)).toBeInTheDocument()
  })

  fireEvent.click(queryByText(/delete this item/i))

  expect(window.confirm).toHaveBeenCalled()

  await waitFor(() => {
    expect(deleteItem.result).toHaveBeenCalled()
    expect(items.result).toHaveBeenCalled()

    const updatedCache = cache.readQuery({query: ITEMS_CONNECTION_QUERY})

    expect(updatedCache.itemsConnection).toHaveProperty('totalCount', 1)
  })
})
