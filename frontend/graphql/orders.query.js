import gql from 'graphql-tag'

const ORDERS_QUERY = gql`
  query {
    orders {
      _id
      total
      createdAt
      items {
        quantity
      }
    }
  }
`

export default ORDERS_QUERY
