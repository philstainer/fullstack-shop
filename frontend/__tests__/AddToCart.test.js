import {render, fireEvent, waitFor} from '@testing-library/react'
import {MockedProvider} from '@apollo/react-testing'

import AddToCart from '#root/components/AddToCart'
import {fakeUser, fakeItem, fakeCartItem} from '#root/utils/testUtils'

import ME_QUERY from '#root/graphql/me.query'
import ADD_TO_CART_MUTATION from '#root/graphql/addToCart.mutation'

const id = fakeItem()._id

test('renders button', async () => {
  const {getByText} = render(
    <MockedProvider>
      <AddToCart id={id} />
    </MockedProvider>,
  )

  expect(getByText(/add to cart/i)).toBeInTheDocument()
})

test('adds item to cart and refetch user', async () => {
  const addItemMock = {
    request: {query: ADD_TO_CART_MUTATION, variables: {id}},
    result: jest.fn(() => ({data: {addToCart: fakeCartItem()}})),
  }

  const meMock = {
    request: {query: ME_QUERY},
    result: jest.fn(() => ({data: {me: fakeUser()}})),
  }

  const {getByText} = render(
    <MockedProvider mocks={[addItemMock, meMock]} addTypename={false}>
      <AddToCart id={id} />
    </MockedProvider>,
  )

  const button = await getByText(/add to cart/i)

  fireEvent.click(button)
  expect(button).toBeDisabled()
  expect(button).toHaveTextContent(/adding/i)

  await waitFor(() => {
    expect(addItemMock.result).toHaveBeenCalled()
    expect(meMock.result).toHaveBeenCalled()
  })
})
