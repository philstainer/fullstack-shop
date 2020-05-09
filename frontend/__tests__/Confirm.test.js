import Router from 'next/router'
import {MockedProvider} from '@apollo/react-testing'
import {GraphQLError} from 'graphql'
import {render, waitFor} from '@testing-library/react'

import ME_QUERY from '#root/graphql/me.query'
import CONFIRM_ACCOUNT_MUTATION from '#root/graphql/confirmAccount.mutation'
import {fakeUser} from '#root/utils/testUtils'

import Confirm from '#root/pages/confirm'

const confirmToken = 'abc1235'

Router.router = {replace() {}}

const successMocks = [
  {
    request: {query: CONFIRM_ACCOUNT_MUTATION, variables: {confirmToken}},
    result: jest.fn(() => ({
      data: {confirmAccount: {status: 'Success', message: 'Message'}},
    })),
  },
  {
    request: {query: ME_QUERY},
    result: jest.fn(() => ({data: {me: fakeUser()}})),
  },
]

const failureMock = {
  request: {query: CONFIRM_ACCOUNT_MUTATION, variables: {confirmToken}},
  result: jest.fn(() => ({
    errors: [new GraphQLError('Error confirming account')],
  })),
}

test('confirms account and redirects', async () => {
  Router.router.replace = jest.fn()

  render(
    <MockedProvider mocks={successMocks} addTypename={false}>
      <Confirm query={{confirmToken}} />
    </MockedProvider>,
  )

  await waitFor(() => {
    expect(successMocks[0].result).toHaveBeenCalled()
    expect(successMocks[1].result).toHaveBeenCalled()
    expect(Router.router.replace).toHaveBeenCalled()
  })
})

test('renders error on failure to confirm account', async () => {
  Router.router.replace = jest.fn()

  const {getByText} = render(
    <MockedProvider mocks={[failureMock]} addTypename={false}>
      <Confirm query={{confirmToken}} />
    </MockedProvider>,
  )

  await waitFor(() => {
    expect(failureMock.result).toHaveBeenCalled()
    expect(getByText(/error confirming account/i)).toBeInTheDocument()
    expect(Router.router.replace).not.toHaveBeenCalled()
  })
})
