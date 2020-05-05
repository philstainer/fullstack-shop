import {render, fireEvent, waitFor} from '@testing-library/react'
import {MockedProvider} from '@apollo/react-testing'
import {InMemoryCache} from 'apollo-cache-inmemory'

import AuthModal from '#root/components/AuthModal'
import {AUTH_MODAL_QUERY} from '#root/graphql/localResolvers'

test('renders when authModal is true', async () => {
  const cache = new InMemoryCache()

  cache.writeData({
    data: {
      authModal: 0,
    },
  })

  const {findByTestId} = render(
    <MockedProvider addTypename={false} cache={cache} resolvers={{}}>
      <AuthModal />
    </MockedProvider>,
  )

  const modal = await findByTestId('modal')

  expect(modal).toBeInTheDocument()
})

test('does not render when authModal is false', async () => {
  const cache = new InMemoryCache()

  cache.writeData({
    data: {
      authModal: null,
    },
  })

  const {container} = render(
    <MockedProvider addTypename={false} cache={cache} resolvers={{}}>
      <AuthModal />
    </MockedProvider>,
  )

  await waitFor(() => expect(container.firstChild).toBeNull())
})
