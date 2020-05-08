import gql from 'graphql-tag'

const SIGN_OUT_MUTATION = gql`
  mutation {
    signOut {
      status
    }
  }
`

export default SIGN_OUT_MUTATION
