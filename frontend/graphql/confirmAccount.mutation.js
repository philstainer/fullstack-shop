import gql from 'graphql-tag'

const CONFIRM_ACCOUNT_MUTATION = gql`
  mutation($confirmToken: String!) {
    confirmAccount(confirmToken: $confirmToken) {
      status
      message
    }
  }
`

export default CONFIRM_ACCOUNT_MUTATION
