import {render, fireEvent, waitFor} from '@testing-library/react'
import {MockedProvider} from '@apollo/react-testing'
import {GraphQLError} from 'graphql'

import Update from '#root/pages/update'
import ITEM_QUERY from '#root/graphql/item.query'
import UPDATE_ITEM_MUTATION from '#root/graphql/updateItem.mutation'
import {fakeItem} from '#root/utils/testUtils'

test('should fetch item on mount and have loading status', async () => {
  const itemMock = {
    request: {query: ITEM_QUERY, variables: {id: fakeItem()._id}},
    result: jest.fn(() => ({data: {item: fakeItem()}})),
  }

  const {getByText} = render(
    <MockedProvider mocks={[itemMock]} addTypename={false}>
      <Update query={{id: fakeItem()._id}} />
    </MockedProvider>,
  )

  expect(getByText(/loading/i)).toBeInTheDocument()

  await waitFor(() => {
    expect(itemMock.result).toHaveBeenCalled()
  })
})

test('should show form errors', async () => {
  const itemMock = {
    request: {query: ITEM_QUERY, variables: {id: fakeItem()._id}},
    result: jest.fn(() => ({data: {item: fakeItem()}})),
  }

  const {getByText, getByTestId} = render(
    <MockedProvider mocks={[itemMock]} addTypename={false}>
      <Update query={{id: fakeItem()._id}} />
    </MockedProvider>,
  )

  await waitFor(() => {
    expect(itemMock.result).toHaveBeenCalled()
  })

  fireEvent.change(getByTestId('title'), {target: {value: ''}})
  fireEvent.change(getByTestId('description'), {target: {value: ''}})
  fireEvent.change(getByTestId('price'), {target: {value: ''}})
  fireEvent.click(getByTestId('submit'))

  await waitFor(() => {
    expect(getByText(/you must specify a title/i)).toBeInTheDocument()
    expect(getByText(/you must specify a description/i)).toBeInTheDocument()
    expect(getByText(/you must specify a price/i)).toBeInTheDocument()
  })
})

test('should show fetch item error', async () => {
  const itemMock = {
    request: {query: ITEM_QUERY, variables: {id: fakeItem()._id}},
    result: jest.fn(() => ({errors: [new GraphQLError()]})),
  }

  const {getByText} = render(
    <MockedProvider mocks={[itemMock]} addTypename={false}>
      <Update query={{id: fakeItem()._id}} />
    </MockedProvider>,
  )

  await waitFor(() => {
    expect(itemMock.result).toHaveBeenCalled()
    expect(getByText(/failed to load item/i)).toBeInTheDocument()
  })
})

test('populates form with item data', async () => {
  const itemMock = {
    request: {query: ITEM_QUERY, variables: {id: fakeItem()._id}},
    result: jest.fn(() => ({data: {item: fakeItem()}})),
  }

  const {getByTestId} = render(
    <MockedProvider mocks={[itemMock]} addTypename={false}>
      <Update query={{id: fakeItem()._id}} />
    </MockedProvider>,
  )

  await waitFor(() => {
    expect(itemMock.result).toHaveBeenCalled()

    expect(getByTestId('title')).toHaveValue(fakeItem().title)
    expect(getByTestId('image-preview')).toHaveAttribute(
      'src',
      fakeItem().imageUrl,
    )
    expect(getByTestId('description')).toHaveValue(fakeItem().description)
    expect(getByTestId('price')).toHaveValue(fakeItem().price)
  })
})

test('should update item without imageUrl when no image', async () => {
  // eslint-disable-next-line no-undef
  globalThis.fetch = jest.fn()

  const newTitle = 'New title'

  const itemMock = {
    request: {query: ITEM_QUERY, variables: {id: fakeItem()._id}},
    result: jest.fn(() => ({data: {item: fakeItem()}})),
  }

  const updateMock = {
    request: {
      query: UPDATE_ITEM_MUTATION,
      variables: {
        id: fakeItem()._id,
        title: newTitle,
        description: fakeItem().description,
        price: (fakeItem().price * 100).toFixed() * 1,
      },
    },
    result: jest.fn(() => ({data: {updateItem: fakeItem()}})),
  }

  const {getByTestId} = render(
    <MockedProvider mocks={[itemMock, updateMock]} addTypename={false}>
      <Update query={{id: fakeItem()._id}} />
    </MockedProvider>,
  )

  await waitFor(() => {
    expect(itemMock.result).toHaveBeenCalled()
  })

  fireEvent.change(getByTestId('title'), {target: {value: newTitle}})
  fireEvent.click(getByTestId('submit'))

  await waitFor(() => {
    expect(updateMock.result).toHaveBeenCalled()
    // eslint-disable-next-line no-undef
    expect(globalThis.fetch).not.toHaveBeenCalled()
  })
})

test('should update item with imageUrl when image selected', async () => {
  const fakeImageUrl = 'http://fakeUrl'

  // eslint-disable-next-line no-undef
  globalThis.fetch = jest.fn(() => ({
    json: () => ({secure_url: fakeImageUrl}),
  }))

  const file = new File(['(⌐□_□)'], 'fakeFile.png', {type: 'image/png'})

  const item = {
    title: 'Item title',
    files: [file],
    desc: 'Awesome item description',
    price: 29.99,
  }

  const itemMock = {
    request: {query: ITEM_QUERY, variables: {id: fakeItem()._id}},
    result: jest.fn(() => ({data: {item: fakeItem()}})),
  }

  const updateMock = {
    request: {
      query: UPDATE_ITEM_MUTATION,
      variables: {
        id: fakeItem()._id,
        title: fakeItem().title,
        description: fakeItem().description,
        price: (fakeItem().price * 100).toFixed() * 1,
        imageUrl: fakeImageUrl,
      },
    },
    result: jest.fn(() => ({data: {updateItem: fakeItem()}})),
  }

  const {getByTestId, getByText} = render(
    <MockedProvider mocks={[itemMock, updateMock]} addTypename={false}>
      <Update query={{id: fakeItem()._id}} />
    </MockedProvider>,
  )

  await waitFor(() => {
    expect(itemMock.result).toHaveBeenCalled()
  })

  Object.defineProperty(getByTestId('image'), 'files', {value: item.files})
  Object.defineProperty(getByTestId('image'), 'value', {
    value: item.files[0].name,
  })

  fireEvent.click(getByTestId('submit'))

  await waitFor(() => {
    // eslint-disable-next-line no-undef
    expect(globalThis.fetch).toHaveBeenCalled()
    expect(updateMock.result).toHaveBeenCalled()
    expect(getByText(/item updated/i)).toBeInTheDocument()
  })
})
