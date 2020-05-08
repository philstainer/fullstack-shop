import gql from 'graphql-tag'

const RESET_PASSWORD_MUTATION = gql`
  mutation(
    $resetToken: String!
    $password: String!
    $confirmPassword: String!
  ) {
    resetPassword(
      resetToken: $resetToken
      password: $password
      confirmPassword: $confirmPassword
    ) {
      _id
    }
  }
`

export default RESET_PASSWORD_MUTATION
