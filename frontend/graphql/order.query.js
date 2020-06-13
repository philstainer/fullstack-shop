import gql from 'graphql-tag'

const ORDER_QUERY = gql`
  query($id: ID!) {
    order(id: $id) {
      _id
      charge
      total
      createdAt
      items {
        _id
        title
        description
        imageUrl
        price
        quantity
      }
    }
  }
`

export default ORDER_QUERY
