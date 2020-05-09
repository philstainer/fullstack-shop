import {render, fireEvent, waitFor} from '@testing-library/react'
import {MockedProvider} from '@apollo/react-testing'
import {GraphQLError} from 'graphql'

import SignUp from '#root/components/SignUp'
import SIGN_UP_MUTATION from '#root/graphql/signUp.mutation'
import ME_QUERY from '#root/graphql/me.query'
import {fakeUser} from '#root/utils/testUtils'

const user = fakeUser()
const password = 'StrongPa55w0rd@'

const mocks = [
  {
    request: {
      query: SIGN_UP_MUTATION,
      variables: {
        name: user.name,
        email: user.email,
        password,
        confirmPassword: password,
      },
    },
    result: jest.fn(() => ({data: {signUp: user}})),
  },
  {request: {query: ME_QUERY}, result: jest.fn(() => ({data: {me: user}}))},
]

const signUpErrorMock = {
  request: {
    query: SIGN_UP_MUTATION,
    variables: {
      name: user.name,
      email: user.email,
      password,
      confirmPassword: password,
    },
  },
  result: jest.fn(() => ({
    errors: [new GraphQLError('Error signing up...')],
  })),
}

const localResolvers = {Mutation: {toggleAuthModal: jest.fn()}}

test('renders sign up form', () => {
  const {getByTestId} = render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <SignUp />
    </MockedProvider>,
  )

  const nameField = getByTestId('name')
  const emailField = getByTestId('email')
  const passwordField = getByTestId('password')
  const confirmPasswordField = getByTestId('confirmPassword')
  const submitButton = getByTestId('submit')

  expect(nameField).toBeInTheDocument()
  expect(emailField).toBeInTheDocument()
  expect(passwordField).toBeInTheDocument()
  expect(confirmPasswordField).toBeInTheDocument()
  expect(submitButton).toBeInTheDocument()
})

test('renders form validation messages', async () => {
  const {findByText, getByTestId} = render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <SignUp />
    </MockedProvider>,
  )

  const submitButton = getByTestId('submit')

  fireEvent.click(submitButton)

  const nameMessage = await findByText('You must specify your name')
  const emailMessage = await findByText('You must specify a valid email')
  const passwordMessage = await findByText('You must specify a password')
  const confirmPasswordMessage = await findByText(
    'You must confirm your password',
  )

  expect(nameMessage).toBeInTheDocument()
  expect(emailMessage).toBeInTheDocument()
  expect(passwordMessage).toBeInTheDocument()
  expect(confirmPasswordMessage).toBeInTheDocument()
})

test('renders name validation message', async () => {
  const {findByText, getByTestId} = render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <SignUp />
    </MockedProvider>,
  )

  const nameField = getByTestId('name')
  const submitButton = getByTestId('submit')

  fireEvent.change(nameField, {target: {value: 'a'}})
  fireEvent.click(submitButton)

  const nameToShort = await findByText(/3 characters min/i)
  expect(nameToShort).toBeInTheDocument()

  fireEvent.change(nameField, {
    target: {value: 'abcdefghijklmnopqrstuvwxyz12345'},
  })
  fireEvent.click(submitButton)

  const nameToLong = await findByText(/30 characters max/i)
  expect(nameToLong).toBeInTheDocument()
})

test('renders password validation message when invalid pattern', async () => {
  const {findByText, getByTestId} = render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <SignUp />
    </MockedProvider>,
  )

  const passwordField = getByTestId('password')
  const submitButton = getByTestId('submit')

  fireEvent.change(passwordField, {target: {value: 'abcd'}})
  fireEvent.click(submitButton)

  const passwordInvalid = await findByText(/password must contain/i)

  expect(passwordInvalid).toBeInTheDocument()
})

test("renders confirm password validation message when passwords don't match", async () => {
  const {findByText, getByTestId} = render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <SignUp />
    </MockedProvider>,
  )

  const passwordField = getByTestId('password')
  const confirmPasswordField = getByTestId('confirmPassword')
  const submitButton = getByTestId('submit')

  fireEvent.change(passwordField, {target: {value: 'Password1!'}})
  fireEvent.change(confirmPasswordField, {target: {value: 'Password1'}})
  fireEvent.click(submitButton)

  const confirmPasswordInvalid = await findByText(/passwords do not match/i)
  expect(confirmPasswordInvalid).toBeInTheDocument()
})

test('renders error on graphql error', async () => {
  const {getByTestId, getByText} = render(
    <MockedProvider mocks={[signUpErrorMock]} addTypename={false}>
      <SignUp />
    </MockedProvider>,
  )

  const nameField = getByTestId('name')
  const emailField = getByTestId('email')
  const passwordField = getByTestId('password')
  const confirmPasswordField = getByTestId('confirmPassword')
  const submitButton = getByTestId('submit')

  fireEvent.change(nameField, {target: {value: user.name}})
  fireEvent.change(emailField, {target: {value: user.email}})
  fireEvent.change(passwordField, {target: {value: password}})
  fireEvent.change(confirmPasswordField, {target: {value: password}})
  fireEvent.click(submitButton)

  await waitFor(() => {
    expect(getByText(/error signing up/i)).toBeInTheDocument()
    expect(signUpErrorMock.result).toHaveBeenCalled()
  })
})

test('successfully signs up on valid form', async () => {
  const {getByTestId} = render(
    <MockedProvider
      mocks={mocks}
      addTypename={false}
      resolvers={localResolvers}
    >
      <SignUp />
    </MockedProvider>,
  )

  const nameField = getByTestId('name')
  const emailField = getByTestId('email')
  const passwordField = getByTestId('password')
  const confirmPasswordField = getByTestId('confirmPassword')
  const submitButton = getByTestId('submit')

  fireEvent.change(nameField, {target: {value: user.name}})
  fireEvent.change(emailField, {target: {value: user.email}})
  fireEvent.change(passwordField, {target: {value: password}})
  fireEvent.change(confirmPasswordField, {target: {value: password}})
  fireEvent.click(submitButton)

  await waitFor(() => {
    expect(mocks[0].result).toHaveBeenCalled()
    expect(mocks[1].result).toHaveBeenCalled()
    expect(localResolvers.Mutation.toggleAuthModal).toHaveBeenCalled()
  })
})
