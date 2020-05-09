import Link from 'next/link'
import {useQuery, useMutation} from '@apollo/react-hooks'

import ME_QUERY from '#root/graphql/me.query'
import {AUTH_MODAL_MUTATION} from '#root/graphql/localResolvers'
import StyledActions from '#root/components/styles/StyledActions'

const Actions = () => {
  const {data, loading, error} = useQuery(ME_QUERY)
  const [toggleAuthModal] = useMutation(AUTH_MODAL_MUTATION)

  // if (error) return <div>Error fetching user details...</div>
  if (loading && !data) return <div>Loading user details...</div>

  return (
    <StyledActions>
      {!data?.me && (
        <li onClick={toggleAuthModal}>
          <a>Sign In</a>
        </li>
      )}

      {data?.me && (
        <>
          <li>
            <Link href="/sell">
              <a>Sell</a>
            </Link>
          </li>

          <li>
            <Link href="/account">
              <a>Account</a>
            </Link>
          </li>
        </>
      )}
    </StyledActions>
  )
}

export default Actions
