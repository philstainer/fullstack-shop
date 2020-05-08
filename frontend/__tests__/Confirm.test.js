import Router from 'next/router'
import {MockedProvider} from '@apollo/react-testing'
import {GraphQLError} from 'graphql'
import {render, waitFor} from '@testing-library/react'

import Confirm from '#root/pages/confirm'
import CONFIRM_ACCOUNT_MUTATION from '#root/graphql/confirmAccount.mutation'

const confirmToken = 'abc1235'

Router.router = {replace() {}}

const successMocks = [
  {
    request: {query: CONFIRM_ACCOUNT_MUTATION, variables: {confirmToken}},
    result: jest.fn(() => ({
      data: {confirmAccount: {status: 'Success', message: 'Message'}},
    })),
  },
]

test('renders errors on failure to confirm account', async () => {
  Router.router.replace = jest.fn()

  render(
    <MockedProvider mocks={successMocks} addTypename={false}>
      <Confirm query={{confirmToken}} />
    </MockedProvider>,
  )

  await waitFor(() => {
    expect(successMocks[0].result).toHaveBeenCalled()
    expect(Router.router.replace).toHaveBeenCalled()
  })
})

test('renders error on failure to confirm account', async () => {
  Router.router.replace = jest.fn()

  const failureMocks = [
    {
      request: {query: CONFIRM_ACCOUNT_MUTATION, variables: {confirmToken}},
      result: jest.fn(() => ({
        errors: [new GraphQLError('Error confirming account')],
      })),
    },
  ]

  const {getByText} = render(
    <MockedProvider mocks={failureMocks} addTypename={false}>
      <Confirm query={{confirmToken}} />
    </MockedProvider>,
  )

  await waitFor(() => {
    expect(failureMocks[0].result).toHaveBeenCalled()
    expect(getByText(/error confirming account/i)).toBeInTheDocument()
    expect(Router.router.replace).not.toHaveBeenCalled()
  })
})
