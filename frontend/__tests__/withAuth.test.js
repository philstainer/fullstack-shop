import {render, waitFor} from '@testing-library/react'
import {MockedProvider} from '@apollo/react-testing'
import {GraphQLError} from 'graphql'

import ME_QUERY from '#root/graphql/me.query'
import {fakeUser} from '#root/utils/testUtils'

import withAuth from '#root/components/withAuth'

const signedInMock = {
  request: {query: ME_QUERY},
  result: jest.fn(() => ({data: {me: fakeUser()}})),
}

const signedOutMock = {
  request: {query: ME_QUERY},
  result: jest.fn(() => ({data: {me: null}})),
}

const signedErrorMock = {
  request: {query: ME_QUERY},
  result: jest.fn(() => ({
    errors: [new GraphQLError('Error loading account details')],
  })),
}

const AuthComponent = withAuth(() => <div>auth success</div>)

test('initial state of loading', async () => {
  const {getByText} = render(
    <MockedProvider mocks={[signedInMock]} addTypename={false}>
      <AuthComponent />
    </MockedProvider>,
  )

  expect(getByText(/loading/i)).toBeInTheDocument()

  await waitFor(() => {
    expect(signedInMock.result).toHaveBeenCalled()
  })

  signedInMock.result.mockClear()
})

test('renders auth error when not logged in', async () => {
  const {getByText} = render(
    <MockedProvider mocks={[signedOutMock]} addTypename={false}>
      <AuthComponent />
    </MockedProvider>,
  )

  await waitFor(() => {
    expect(getByText(/you are not logged in/i)).toBeInTheDocument()
    expect(signedOutMock.result).toHaveBeenCalled()
  })
})

test('renders error on graphql error', async () => {
  const {getByText} = render(
    <MockedProvider mocks={[signedErrorMock]} addTypename={false}>
      <AuthComponent />
    </MockedProvider>,
  )

  await waitFor(() => {
    expect(getByText(/error loading/i)).toBeInTheDocument()
    expect(signedErrorMock.result).toHaveBeenCalled()
  })
})

test('renders component when logged in', async () => {
  const {getByText} = render(
    <MockedProvider mocks={[signedInMock]} addTypename={false}>
      <AuthComponent />
    </MockedProvider>,
  )

  await waitFor(() => {
    expect(getByText(/auth success/i)).toBeInTheDocument()
    expect(signedInMock.result).toHaveBeenCalled()
  })
})
