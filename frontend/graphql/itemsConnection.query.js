import gql from 'graphql-tag'

const ITEMS_CONNECTION_QUERY = gql`
  {
    itemsConnection {
      totalCount
    }
  }
`

export default ITEMS_CONNECTION_QUERY
