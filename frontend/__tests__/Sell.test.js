import {render, fireEvent, waitFor} from '@testing-library/react'
import {MockedProvider} from '@apollo/react-testing'
import {GraphQLError} from 'graphql'

import Sell from '#root/pages/sell'
import CREATE_ITEM_MUTATION from '#root/graphql/createItem.mutation'

const file = new File(['(⌐□_□)'], 'fakeFile.png', {type: 'image/png'})
const fakeImageUrl = 'https://fake-image.com'
const item = {
  title: 'Item title',
  files: [file],
  desc: 'Awesome item description',
  price: 29.99,
}

test('renders fields', () => {
  const {getByTestId} = render(
    <MockedProvider>
      <Sell />
    </MockedProvider>,
  )

  expect(getByTestId('title')).toBeInTheDocument()
  expect(getByTestId('image')).toBeInTheDocument()
  expect(getByTestId('description')).toBeInTheDocument()
  expect(getByTestId('price')).toBeInTheDocument()
})

test('renders errors on required fields', async () => {
  const {getByTestId, findByText} = render(
    <MockedProvider>
      <Sell />
    </MockedProvider>,
  )

  fireEvent.click(getByTestId('submit'))

  expect(await findByText(/specify a title/i)).toBeInTheDocument()
  expect(await findByText(/specify an image/i)).toBeInTheDocument()
  expect(await findByText(/specify a description/i)).toBeInTheDocument()
  expect(await findByText(/specify a price/i)).toBeInTheDocument()
})

test('renders error on graphql error', async () => {
  globalThis.fetch = jest.fn(() => ({
    json: () => ({secure_url: fakeImageUrl}),
  }))

  const mock = {
    request: {
      query: CREATE_ITEM_MUTATION,
      variables: {
        title: item.title,
        description: item.desc,
        imageUrl: fakeImageUrl,
        price: (item.price * 100).toFixed() * 1,
      },
    },
    result: jest.fn(() => ({
      errors: [new GraphQLError('Error creating item...')],
    })),
  }

  const {getByTestId, getByText} = render(
    <MockedProvider mocks={[mock]} addTypename={false}>
      <Sell />
    </MockedProvider>,
  )

  fireEvent.change(getByTestId('title'), {target: {value: item.title}})

  Object.defineProperty(getByTestId('image'), 'files', {value: item.files})
  Object.defineProperty(getByTestId('image'), 'value', {
    value: item.files[0].name,
  })

  fireEvent.change(getByTestId('description'), {target: {value: item.desc}})
  fireEvent.change(getByTestId('price'), {target: {value: item.price}})
  fireEvent.click(getByTestId('submit'))

  await waitFor(() => {
    expect(mock.result).toHaveBeenCalled()
    expect(getByText(/error creating item/i)).toBeInTheDocument()
  })
})

test('renders success message on createdItem and resets form', async () => {
  globalThis.fetch = jest.fn(() => ({
    json: () => ({secure_url: fakeImageUrl}),
  }))

  const mock = {
    request: {
      query: CREATE_ITEM_MUTATION,
      variables: {
        title: item.title,
        description: item.desc,
        imageUrl: fakeImageUrl,
        price: (item.price * 100).toFixed() * 1,
      },
    },
    result: jest.fn(() => ({data: {createItem: {_id: 'acb123'}}})),
  }

  const {getByTestId, getByText} = render(
    <MockedProvider mocks={[mock]} addTypename={false}>
      <Sell />
    </MockedProvider>,
  )

  fireEvent.change(getByTestId('title'), {target: {value: item.title}})

  Object.defineProperty(getByTestId('image'), 'files', {value: item.files})
  Object.defineProperty(getByTestId('image'), 'value', {
    value: item.files[0].name,
  })

  fireEvent.change(getByTestId('description'), {target: {value: item.desc}})
  fireEvent.change(getByTestId('price'), {target: {value: item.price}})
  fireEvent.click(getByTestId('submit'))

  await waitFor(() => {
    expect(mock.result).toHaveBeenCalled()
    expect(getByText(/item created successfully/i)).toBeInTheDocument()
  })
})
