import {render, fireEvent, waitFor} from '@testing-library/react'
import Router from 'next/router'
import {MockedProvider} from '@apollo/react-testing'
import {GraphQLError} from 'graphql'

import Reset from '#root/pages/reset'

import RESET_PASSWORD_MUTATION from '#root/graphql/resetPassword.mutation'
import ME_QUERY from '#root/graphql/me.query'
import {fakeUser} from '#root/utils/testUtils'

Router.router = {replace() {}}

const user = fakeUser()
const password = 'StrongPa55w0rd@'
const resetToken = 'abc12345'

const meQueryMock = {
  request: {query: ME_QUERY},
  result: jest.fn(() => ({data: {me: user}})),
}

const resetPasswordMockSuccess = {
  request: {
    query: RESET_PASSWORD_MUTATION,
    variables: {
      resetToken,
      password,
      confirmPassword: password,
    },
  },
  result: jest.fn(() => ({data: {resetPassword: {_id: user._id}}})),
}

const resetPasswordMockFailure = {
  request: {
    query: RESET_PASSWORD_MUTATION,
    variables: {
      resetToken,
      password,
      confirmPassword: password,
    },
  },
  result: jest.fn(() => ({
    errors: [new GraphQLError('Error resetting password')],
  })),
}

test('renders reset form', () => {
  const {getByTestId} = render(
    <MockedProvider>
      <Reset query={{resetToken}} />
    </MockedProvider>,
  )

  expect(getByTestId('password')).toBeInTheDocument()
  expect(getByTestId('confirmPassword')).toBeInTheDocument()
})

test('validates form', async () => {
  const {getByTestId, findByText} = render(
    <MockedProvider>
      <Reset query={{resetToken}} />
    </MockedProvider>,
  )

  const passwordField = getByTestId('password')
  const confirmPasswordField = getByTestId('confirmPassword')
  const submitButton = getByTestId('submit')

  fireEvent.click(submitButton)

  expect(await findByText('You must specify a password')).toBeInTheDocument()
  expect(await findByText('You must confirm your password')).toBeInTheDocument()

  fireEvent.change(passwordField, {target: {value: password}})
  fireEvent.click(submitButton)

  expect(
    await findByText('You must specify a password'),
  ).not.toBeInTheDocument()
  expect(await findByText('You must confirm your password')).toBeInTheDocument()

  fireEvent.change(confirmPasswordField, {target: {value: 'abc'}})
  fireEvent.click(submitButton)

  expect(await findByText('The passwords do not match')).toBeInTheDocument()

  fireEvent.change(confirmPasswordField, {target: {value: password}})
  fireEvent.click(submitButton)

  expect(await findByText('The passwords do not match')).not.toBeInTheDocument()
})

test('renders any api errors', async () => {
  Router.router.replace = jest.fn()

  const {getByTestId, getByText} = render(
    <MockedProvider mocks={[resetPasswordMockFailure]} addTypename={false}>
      <Reset query={{resetToken}} />
    </MockedProvider>,
  )

  const passwordField = getByTestId('password')
  const confirmPasswordField = getByTestId('confirmPassword')
  const submitButton = getByTestId('submit')

  fireEvent.change(passwordField, {target: {value: password}})
  fireEvent.change(confirmPasswordField, {target: {value: password}})
  fireEvent.click(submitButton)

  await waitFor(() => {
    expect(resetPasswordMockFailure.result).toHaveBeenCalled()
    expect(getByText(/error resetting password/i)).toBeInTheDocument()
    expect(Router.router.replace).not.toHaveBeenCalled()
  })
})

test('submit form when validate and redirect to home', async () => {
  Router.router.replace = jest.fn()

  const {getByTestId} = render(
    <MockedProvider
      mocks={[resetPasswordMockSuccess, meQueryMock]}
      addTypename={false}
    >
      <Reset query={{resetToken}} />
    </MockedProvider>,
  )

  const passwordField = getByTestId('password')
  const confirmPasswordField = getByTestId('confirmPassword')
  const submitButton = getByTestId('submit')

  fireEvent.change(passwordField, {target: {value: password}})
  fireEvent.change(confirmPasswordField, {target: {value: password}})
  fireEvent.click(submitButton)

  await waitFor(() => {
    expect(resetPasswordMockSuccess.result).toHaveBeenCalled()
    expect(meQueryMock.result).toHaveBeenCalled()
    expect(Router.router.replace).toHaveBeenCalled()
  })
})
