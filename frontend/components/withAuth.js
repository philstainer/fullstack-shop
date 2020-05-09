import PropTypes from 'prop-types'
import {useQuery} from '@apollo/react-hooks'

import ME_QUERY from '#root/graphql/me.query'

const withAuth = AuthComponent => {
  return props => {
    const {data, loading, error} = useQuery(ME_QUERY)

    if (loading) return <div>Loading...</div>
    if (error) return <div>{error.message}</div>
    if (!loading && !data?.me) return <div>You are not logged in!</div>

    return <AuthComponent {...props} />
  }
}

export default withAuth
