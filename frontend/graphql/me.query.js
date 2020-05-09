import gql from 'graphql-tag'

const ME_QUERY = gql`
  query me {
    me {
      _id
      name
      email
      confirmed
      permissions
    }
  }
`

export default ME_QUERY
