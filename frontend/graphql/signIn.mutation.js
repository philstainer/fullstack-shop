import gql from 'graphql-tag'

const SIGN_IN_MUTATION = gql`
  mutation signIn($email: String!, $password: String!) {
    signIn(email: $email, password: $password) {
      _id
      name
      email
    }
  }
`

export default SIGN_IN_MUTATION
