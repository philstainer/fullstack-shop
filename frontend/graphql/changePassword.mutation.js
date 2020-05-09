import gql from 'graphql-tag'

const CHANGE_PASSWORD_MUTATION = gql`
  mutation(
    $currentPassword: String!
    $password: String!
    $confirmPassword: String!
  ) {
    changePassword(
      currentPassword: $currentPassword
      password: $password
      confirmPassword: $confirmPassword
    ) {
      status
      message
    }
  }
`

export default CHANGE_PASSWORD_MUTATION
