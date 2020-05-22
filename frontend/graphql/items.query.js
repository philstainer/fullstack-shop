import gql from 'graphql-tag'

const ITEMS_QUERY = gql`
  query($skip: Int, $limit: Int) {
    items(skip: $skip, limit: $limit) {
      _id
      title
      description
      imageUrl
      price
    }
  }
`

export default ITEMS_QUERY
