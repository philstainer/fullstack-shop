import React from 'react'
import Link from 'next/link'
import {useQuery, useMutation} from '@apollo/react-hooks'

import ME_QUERY from '#root/graphql/me.query'
import SIGN_OUT_MUTATION from '#root/graphql/signOut.mutation'

import StyledTopbar from '#root/components/styles/StyledTopbar'

const Topbar = () => {
  const {data, loading, error} = useQuery(ME_QUERY)

  const [signOut] = useMutation(SIGN_OUT_MUTATION, {
    refetchQueries: [{query: ME_QUERY}],
  })

  return (
    <StyledTopbar>
      <ul>
        <li>
          <Link href="/support">
            <a>Support</a>
          </Link>
        </li>
        <li>
          <Link href="/contact">
            <a>Contact</a>
          </Link>
        </li>
        {data?.me && (
          <li className="highlighted" onClick={signOut}>
            <a>Sign Out</a>
          </li>
        )}
      </ul>
    </StyledTopbar>
  )
}

export default Topbar
