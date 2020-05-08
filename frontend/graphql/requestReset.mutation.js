import gql from 'graphql-tag'

const REQUEST_RESET_MUTATION = gql`
  mutation($email: String!) {
    requestReset(email: $email) {
      status
    }
  }
`

export default REQUEST_RESET_MUTATION
