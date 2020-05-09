import {render, fireEvent, waitFor} from '@testing-library/react'
import {MockedProvider} from '@apollo/react-testing'
import {GraphQLError} from 'graphql'

import RequestReset from '#root/components/RequestReset'
import REQUEST_RESET_MUTATION from '#root/graphql/requestReset.mutation'
import {fakeUser} from '#root/utils/testUtils'

const user = fakeUser()

const mocks = [
  {
    request: {
      query: REQUEST_RESET_MUTATION,
      variables: {email: user.email},
    },
    result: jest.fn(() => ({data: {requestReset: {status: 'Success'}}})),
  },
]

const requestResetErrorMock = {
  request: {
    query: REQUEST_RESET_MUTATION,
    variables: {email: user.email},
  },
  result: jest.fn(() => ({
    errors: [new GraphQLError('Error requesting reset...')],
  })),
}

test('renders form', () => {
  const {getByText} = render(
    <MockedProvider>
      <RequestReset />
    </MockedProvider>,
  )

  const emailField = getByText(/email/i)

  expect(emailField).toBeInTheDocument()
})

test('email field is required, show error if empty', async () => {
  const {findByText, getByText} = render(
    <MockedProvider>
      <RequestReset />
    </MockedProvider>,
  )

  const submitButton = getByText(/request reset/i)
  fireEvent.click(submitButton)

  const emailValidation = await findByText(/valid email/i)

  expect(emailValidation).toBeInTheDocument()
})

test('renders error on graphql error', async () => {
  const {getByTestId, getByText} = render(
    <MockedProvider mocks={[requestResetErrorMock]} addTypename={false}>
      <RequestReset />
    </MockedProvider>,
  )

  const emailField = getByTestId('email')
  fireEvent.change(emailField, {target: {value: user.email}})

  const submitButton = getByText(/request reset/i)
  fireEvent.click(submitButton)

  await waitFor(() => {
    expect(getByText(/error requesting reset/i)).toBeInTheDocument()
    expect(requestResetErrorMock.result).toHaveBeenCalled()
  })
})

test('validates fields on submit', async () => {
  const {getByTestId, getByText} = render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <RequestReset />
    </MockedProvider>,
  )

  const emailField = getByTestId('email')
  fireEvent.change(emailField, {target: {value: user.email}})

  const submitButton = getByText(/request reset/i)
  fireEvent.click(submitButton)

  await waitFor(() => {
    expect(mocks[0].result).toHaveBeenCalled()

    expect(getByText(/check your email for a reset link/i)).toBeInTheDocument()
  })
})
