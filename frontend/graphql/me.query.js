import gql from 'graphql-tag'

const ME_QUERY = gql`
  query me {
    me {
      _id
      name
      email
      confirmed
      permissions
      cart {
        quantity
        item {
          _id
          title
          description
          imageUrl
          price
        }
      }
    }
  }
`

export default ME_QUERY
