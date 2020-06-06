import gql from 'graphql-tag'

const ITEM_QUERY = gql`
  query($id: ID!) {
    item(id: $id) {
      _id
      title
      description
      imageUrl
      price
    }
  }
`

export default ITEM_QUERY
