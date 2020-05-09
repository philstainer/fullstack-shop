import {render, fireEvent, waitFor} from '@testing-library/react'
import {MockedProvider} from '@apollo/react-testing'
import {GraphQLError} from 'graphql'

import ChangePassword from '#root/components/ChangePassword'
import CHANGE_PASSWORD_MUTATION from '#root/graphql/changePassword.mutation'

const passwords = {
  currentPassword: 'Password1@',
  password: 'newPassword1!',
  confirmPassword: 'newPassword1!',
}

const successMock = {
  request: {query: CHANGE_PASSWORD_MUTATION, variables: passwords},
  result: jest.fn(() => ({
    data: {changePassword: {status: 'Success', message: 'Success Message'}},
  })),
}

const failureMock = {
  request: {query: CHANGE_PASSWORD_MUTATION, variables: passwords},
  result: jest.fn(() => ({
    errors: [new GraphQLError('Error changing password')],
  })),
}

test('renders reset form', () => {
  const {getByTestId} = render(
    <MockedProvider>
      <ChangePassword />
    </MockedProvider>,
  )

  expect(getByTestId('currentPassword')).toBeInTheDocument()
  expect(getByTestId('password')).toBeInTheDocument()
  expect(getByTestId('confirmPassword')).toBeInTheDocument()
  expect(getByTestId('submit')).toBeInTheDocument()
})

test('validates form', async () => {
  const {getByTestId, findByText} = render(
    <MockedProvider>
      <ChangePassword />
    </MockedProvider>,
  )

  // Get fields
  const currentPasswordField = getByTestId('currentPassword')
  const passwordField = getByTestId('password')
  const confirmPasswordField = getByTestId('confirmPassword')
  const submitButton = getByTestId('submit')

  // Submit form
  fireEvent.click(submitButton)

  // Check for required errors
  expect(await findByText('You must your password')).toBeInTheDocument()
  expect(await findByText('You must specify a password')).toBeInTheDocument()
  expect(await findByText('You must confirm your password')).toBeInTheDocument()

  // Update the current password, submit and check that error is gone for field
  fireEvent.change(currentPasswordField, {
    target: {value: passwords.currentPassword},
  })
  fireEvent.click(submitButton)
  expect(await findByText('You must your password')).not.toBeInTheDocument()

  // Update the password, submit and check that error is gone for field
  fireEvent.change(passwordField, {target: {value: passwords.password}})
  fireEvent.click(submitButton)
  expect(await findByText('You must confirm your password')).toBeInTheDocument()

  // Update the confirm password with wrong password, submit and check for
  // passwords do not match error
  fireEvent.change(confirmPasswordField, {target: {value: 'I do not match'}})
  fireEvent.click(submitButton)
  expect(await findByText('The passwords do not match')).toBeInTheDocument()

  // Update the confirm password, submit and check that error has disappeared
  fireEvent.change(confirmPasswordField, {
    target: {value: passwords.confirmPassword},
  })
  fireEvent.click(submitButton)
  expect(await findByText('The passwords do not match')).not.toBeInTheDocument()
})

test('renders error on graphql error', async () => {
  const {getByTestId, getByText} = render(
    <MockedProvider mocks={[failureMock]} addTypename={false}>
      <ChangePassword />
    </MockedProvider>,
  )

  // Get fields
  const currentPasswordField = getByTestId('currentPassword')
  const passwordField = getByTestId('password')
  const confirmPasswordField = getByTestId('confirmPassword')
  const submitButton = getByTestId('submit')

  // Set values
  fireEvent.change(currentPasswordField, {
    target: {value: passwords.currentPassword},
  })
  fireEvent.change(passwordField, {target: {value: passwords.password}})
  fireEvent.change(confirmPasswordField, {
    target: {value: passwords.confirmPassword},
  })

  // Submit form
  fireEvent.click(submitButton)

  await waitFor(() => {
    expect(getByText(/error changing password/i)).toBeInTheDocument()
    expect(failureMock.result).toHaveBeenCalled()
  })
})

test('submits and renders success message', async () => {
  const {getByTestId, getByText} = render(
    <MockedProvider mocks={[successMock]} addTypename={false}>
      <ChangePassword />
    </MockedProvider>,
  )

  // Get fields
  const currentPasswordField = getByTestId('currentPassword')
  const passwordField = getByTestId('password')
  const confirmPasswordField = getByTestId('confirmPassword')
  const submitButton = getByTestId('submit')

  // Set values
  fireEvent.change(currentPasswordField, {
    target: {value: passwords.currentPassword},
  })
  fireEvent.change(passwordField, {target: {value: passwords.password}})
  fireEvent.change(confirmPasswordField, {
    target: {value: passwords.confirmPassword},
  })

  // Submit form
  fireEvent.click(submitButton)

  await waitFor(() => {
    expect(failureMock.result).toHaveBeenCalled()
    expect(getByText(/success message/i)).toBeInTheDocument()
  })
})
