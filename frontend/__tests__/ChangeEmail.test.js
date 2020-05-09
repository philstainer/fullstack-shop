import {render, fireEvent, waitFor} from '@testing-library/react'
import {MockedProvider} from '@apollo/react-testing'
import {GraphQLError} from 'graphql'

import ME_QUERY from '#root/graphql/me.query'
import CHANGE_EMAIL_MUTATION from '#root/graphql/changeEmail.mutation'
import {fakeUser} from '#root/utils/testUtils'

import ChangeEmail from '#root/components/ChangeEmail'

const passwords = {
  password: 'newPassword1!',
  email: 'email@email.com',
  confirmEmail: 'email@email.com',
}

const successMock = {
  request: {query: CHANGE_EMAIL_MUTATION, variables: passwords},
  result: jest.fn(() => ({
    data: {changeEmail: {status: 'Success', message: 'Success Message'}},
  })),
}

const failureMock = {
  request: {query: CHANGE_EMAIL_MUTATION, variables: passwords},
  result: jest.fn(() => ({
    errors: [new GraphQLError('Error changing email')],
  })),
}

const meQuery = {
  request: {query: ME_QUERY},
  result: jest.fn(() => ({data: {me: fakeUser()}})),
}

test('renders reset form', () => {
  const {getByTestId} = render(
    <MockedProvider>
      <ChangeEmail />
    </MockedProvider>,
  )

  expect(getByTestId('password')).toBeInTheDocument()
  expect(getByTestId('email')).toBeInTheDocument()
  expect(getByTestId('confirmEmail')).toBeInTheDocument()
  expect(getByTestId('submit')).toBeInTheDocument()
})

test('validates form', async () => {
  const {getByTestId, findByText} = render(
    <MockedProvider>
      <ChangeEmail />
    </MockedProvider>,
  )

  // Get fields
  const passwordField = getByTestId('password')
  const emailField = getByTestId('email')
  const confirmEmailField = getByTestId('confirmEmail')
  const submitButton = getByTestId('submit')

  // Submit form
  fireEvent.click(submitButton)

  // Check for required errors
  expect(await findByText('You must specify your password')).toBeInTheDocument()
  expect(await findByText('You must specify a valid email')).toBeInTheDocument()
  expect(await findByText('You must confirm your email')).toBeInTheDocument()

  // Update the current password, submit and check that error is gone for field
  fireEvent.change(passwordField, {
    target: {value: passwords.password},
  })
  fireEvent.click(submitButton)
  expect(
    await findByText('You must specify your password'),
  ).not.toBeInTheDocument()

  // Update the password, submit and check that error is gone for field
  fireEvent.change(emailField, {target: {value: passwords.email}})
  fireEvent.click(submitButton)
  expect(
    await findByText('You must specify a valid email'),
  ).not.toBeInTheDocument()

  // Update the confirm password with wrong password, submit and check for
  // passwords do not match error
  fireEvent.change(confirmEmailField, {target: {value: 'I do not match'}})
  fireEvent.click(submitButton)
  expect(await findByText('Emails do not match')).toBeInTheDocument()

  // Update the confirm password, submit and check that error has disappeared
  fireEvent.change(confirmEmailField, {
    target: {value: passwords.confirmEmail},
  })
  fireEvent.click(submitButton)
  expect(await findByText('Emails do not match')).not.toBeInTheDocument()
})

test('renders error on graphql error', async () => {
  const {getByTestId, getByText} = render(
    <MockedProvider mocks={[failureMock]} addTypename={false}>
      <ChangeEmail />
    </MockedProvider>,
  )

  // Get fields
  const passwordField = getByTestId('password')
  const emailField = getByTestId('email')
  const confirmEmailField = getByTestId('confirmEmail')
  const submitButton = getByTestId('submit')

  // Set values
  fireEvent.change(passwordField, {
    target: {value: passwords.password},
  })
  fireEvent.change(emailField, {target: {value: passwords.email}})
  fireEvent.change(confirmEmailField, {
    target: {value: passwords.confirmEmail},
  })

  // Submit form
  fireEvent.click(submitButton)

  await waitFor(() => {
    expect(getByText(/error changing email/i)).toBeInTheDocument()
    expect(failureMock.result).toHaveBeenCalled()
  })
})

test('submits and renders success message', async () => {
  const {getByTestId, getByText} = render(
    <MockedProvider mocks={[successMock, meQuery]} addTypename={false}>
      <ChangeEmail />
    </MockedProvider>,
  )

  // Get fields
  const passwordField = getByTestId('password')
  const emailField = getByTestId('email')
  const confirmEmailField = getByTestId('confirmEmail')
  const submitButton = getByTestId('submit')

  // Set values
  fireEvent.change(passwordField, {
    target: {value: passwords.password},
  })
  fireEvent.change(emailField, {target: {value: passwords.email}})
  fireEvent.change(confirmEmailField, {
    target: {value: passwords.confirmEmail},
  })

  // Submit form
  fireEvent.click(submitButton)

  await waitFor(() => {
    expect(failureMock.result).toHaveBeenCalled()
    expect(getByText(/success message/i)).toBeInTheDocument()
  })
})
