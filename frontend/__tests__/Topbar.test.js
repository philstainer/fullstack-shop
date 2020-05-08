import {render, fireEvent, waitFor} from '@testing-library/react'
import {MockedProvider} from '@apollo/react-testing'

import ME_QUERY from '#root/graphql/me.query'
import SIGN_OUT_MUTATION from '#root/graphql/signOut.mutation'
import {fakeUser} from '#root/utils/testUtils'

import Topbar from '#root/components/Topbar'

const signInMe = {
  request: {query: ME_QUERY},
  result: jest.fn(() => ({data: {me: fakeUser()}})),
}

const signOutMe = {
  request: {query: ME_QUERY},
  result: jest.fn(() => ({data: {me: null}})),
}

const signOutMutation = {
  request: {query: SIGN_OUT_MUTATION},
  result: jest.fn(() => ({data: {signOut: {status: 'Success'}}})),
}

test('renders basic links', async () => {
  const {getByText, queryByText} = render(
    <MockedProvider mocks={[signOutMe]} addTypename={false}>
      <Topbar />
    </MockedProvider>,
  )

  expect(getByText(/support/i)).toBeInTheDocument()
  expect(getByText(/contact/i)).toBeInTheDocument()

  await waitFor(() => {
    expect(signOutMe.result).toHaveBeenCalled()

    expect(queryByText(/sign out/i)).toBeNull()
  })
})

test('renders sign out link when logged in', async () => {
  const {getByText} = render(
    <MockedProvider mocks={[signInMe]} addTypename={false}>
      <Topbar />
    </MockedProvider>,
  )

  await waitFor(() => {
    expect(signInMe.result).toHaveBeenCalled()
    expect(getByText(/sign out/i)).toBeInTheDocument()
  })
})

test('clicking on sign out should log you out', async () => {
  const {findByText, queryByText} = render(
    <MockedProvider
      mocks={[signInMe, signOutMutation, signOutMe]}
      addTypename={false}
    >
      <Topbar />
    </MockedProvider>,
  )

  const signOutLink = await findByText(/sign out/i)

  fireEvent.click(signOutLink)

  await waitFor(() => {
    expect(signOutMutation.result).toHaveBeenCalled()
    expect(signOutMe.result).toHaveBeenCalled()
    expect(queryByText(/sign out/i)).toBeNull()
  })
})
