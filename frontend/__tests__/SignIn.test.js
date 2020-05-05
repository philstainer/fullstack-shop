import {render, fireEvent, waitFor} from '@testing-library/react'
import {MockedProvider} from '@apollo/react-testing'

import SignIn from '#root/components/SignIn'
import SIGN_IN_MUTATION from '#root/graphql/signIn.mutation'
import ME_QUERY from '#root/graphql/me.query'
import {fakeUser} from '#root/utils/testUtils'

const user = fakeUser()
const password = 'abc123'

const mocks = [
  {
    request: {
      query: SIGN_IN_MUTATION,
      variables: {email: user.email, password},
    },
    result: jest.fn(() => ({data: {signIn: user}})),
  },
  {request: {query: ME_QUERY}, result: jest.fn(() => ({data: {me: user}}))},
]

const localResolvers = {Mutation: {toggleAuthModal: jest.fn()}}

test('renders sign in form', () => {
  const {findByText, getByText} = render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <SignIn />
    </MockedProvider>,
  )

  const emailField = getByText(/email/i)
  const passwordField = getByText(/password/i)
  const submitButton = getByText(/sign in/i)

  expect(emailField).toBeInTheDocument()
  expect(passwordField).toBeInTheDocument()
  expect(submitButton).toBeInTheDocument()
})

test('validates fields on submit', async () => {
  const {findByText, getByText, debug} = render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <SignIn />
    </MockedProvider>,
  )

  const submitButton = getByText(/sign in/i)

  fireEvent.click(submitButton)

  const emailValidation = await findByText(/valid email/i)
  const passwordValidation = await findByText(/specify a password/i)

  expect(emailValidation).toBeInTheDocument()
  expect(passwordValidation).toBeInTheDocument()
})

test('refetchs me query on success and closes modal', async () => {
  const {getByText, getByTestId} = render(
    <MockedProvider
      mocks={mocks}
      addTypename={false}
      resolvers={localResolvers}
    >
      <SignIn />
    </MockedProvider>,
  )
  const emailField = getByTestId('email')
  const passwordField = getByTestId('password')
  const submitButton = getByText(/sign in/i)

  fireEvent.change(emailField, {target: {value: user.email}})
  fireEvent.change(passwordField, {target: {value: password}})

  fireEvent.click(submitButton)

  await waitFor(() => {
    expect(mocks[0].result).toHaveBeenCalled()
    expect(mocks[1].result).toHaveBeenCalled()
    expect(localResolvers.Mutation.toggleAuthModal).toHaveBeenCalled()
  })
})
