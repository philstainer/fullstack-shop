import gql from 'graphql-tag'

const CHANGE_PASSWORD_MUTATION = gql`
  mutation($password: String!, $email: String!, $confirmEmail: String!) {
    changeEmail(
      password: $password
      email: $email
      confirmEmail: $confirmEmail
    ) {
      status
      message
    }
  }
`

export default CHANGE_PASSWORD_MUTATION
