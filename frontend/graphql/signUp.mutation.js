import gql from 'graphql-tag'

const SIGN_UP_MUTATION = gql`
  mutation signUp(
    $name: String!
    $email: String!
    $password: String!
    $confirmPassword: String!
  ) {
    signUp(
      name: $name
      email: $email
      password: $password
      confirmPassword: $confirmPassword
    ) {
      _id
      name
      email
    }
  }
`

export default SIGN_UP_MUTATION
