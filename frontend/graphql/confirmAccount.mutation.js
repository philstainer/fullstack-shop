import gql from 'graphql-tag'

const SIGN_IN_MUTATION = gql`
  mutation($confirmToken: String!) {
    confirmAccount(confirmToken: $confirmToken) {
      status
      message
    }
  }
`

export default SIGN_IN_MUTATION
