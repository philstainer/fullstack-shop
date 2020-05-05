import gql from 'graphql-tag'

const ME_QUERY = gql`
  query me {
    me {
      _id
      email
      name
    }
  }
`

export default ME_QUERY
