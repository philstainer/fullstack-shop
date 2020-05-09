import {render, waitFor} from '@testing-library/react'
import {MockedProvider} from '@apollo/react-testing'
import {GraphQLError} from 'graphql'

import {Account} from '#root/pages/account'
import ME_QUERY from '#root/graphql/me.query'
import {fakeUser} from '#root/utils/testUtils'

const user = fakeUser()

const signedInMock = {
  request: {query: ME_QUERY},
  result: jest.fn(() => ({data: {me: user}})),
}

const signedErrorMock = {
  request: {query: ME_QUERY},
  result: jest.fn(() => ({
    errors: [new GraphQLError('Error')],
  })),
}

test('initial state of loading', async () => {
  const {getByText} = render(
    <MockedProvider mocks={[signedInMock]} addTypename={false}>
      <Account />
    </MockedProvider>,
  )

  expect(getByText(/loading account/i)).toBeInTheDocument()

  await waitFor(() => {
    expect(signedInMock.result).toHaveBeenCalled()
  })

  signedInMock.result.mockClear()
})

test('renders error on graphql error', async () => {
  const {getByText} = render(
    <MockedProvider mocks={[signedErrorMock]} addTypename={false}>
      <Account />
    </MockedProvider>,
  )

  await waitFor(() => {
    expect(getByText(/failed to load account information/i)).toBeInTheDocument()
    expect(signedErrorMock.result).toHaveBeenCalled()
  })
})

test('renders account information', async () => {
  const {getByText} = render(
    <MockedProvider mocks={[signedInMock]} addTypename={false}>
      <Account />
    </MockedProvider>,
  )

  await waitFor(() => {
    expect(getByText(/welcome/i)).toBeInTheDocument()
    expect(getByText(user.name)).toBeInTheDocument()
    expect(getByText(user.email)).toBeInTheDocument()
    expect(signedInMock.result).toHaveBeenCalled()
  })
})
