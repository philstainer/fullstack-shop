import {render, fireEvent, waitFor} from '@testing-library/react'
import {MockedProvider} from '@apollo/react-testing'

import Actions from '#root/components/Actions'
import ME_QUERY from '#root/graphql/me.query'
import {fakeUser} from '#root/utils/testUtils'

const notSignedInMocks = [
  {request: {query: ME_QUERY}, result: jest.fn(() => ({data: {me: null}}))},
]

const signedInMocks = [
  {
    request: {query: ME_QUERY},
    result: jest.fn(() => ({data: {me: fakeUser()}})),
  },
]

const localResolvers = {
  Mutation: {
    toggleAuthModal: jest.fn(),
  },
}

test('renders minimal links when signed out', async () => {
  const {findByText, getByText} = render(
    <MockedProvider mocks={notSignedInMocks} addTypename={false}>
      <Actions />
    </MockedProvider>,
  )

  expect(getByText(/loading/i)).toBeInTheDocument()

  const signIn = await findByText(/sign in/i)

  expect(signIn).toBeInTheDocument()
  expect(notSignedInMocks[0].result).toHaveBeenCalled()
})

test('toggles authModal on click', async () => {
  const {findByText, getByText} = render(
    <MockedProvider
      mocks={notSignedInMocks}
      addTypename={false}
      resolvers={localResolvers}
    >
      <Actions />
    </MockedProvider>,
  )

  expect(getByText(/loading/i)).toBeInTheDocument()

  const signIn = await findByText(/sign in/i)

  fireEvent.click(signIn)

  await waitFor(() =>
    expect(localResolvers.Mutation.toggleAuthModal).toHaveBeenCalled(),
  )
})

test('renders account links when signed in', async () => {
  const {findByText, getByText} = render(
    <MockedProvider mocks={signedInMocks} addTypename={false}>
      <Actions />
    </MockedProvider>,
  )

  expect(getByText(/loading/i)).toBeInTheDocument()

  const sell = await findByText(/sell/i)
  const account = await findByText(/account/i)

  expect(sell).toBeInTheDocument()
  expect(account).toBeInTheDocument()

  expect(signedInMocks[0].result).toHaveBeenCalled()
})
