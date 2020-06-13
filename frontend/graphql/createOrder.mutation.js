import gql from 'graphql-tag'

const CREATE_ORDER_MUTATION = gql`
  mutation($token: String!) {
    createOrder(token: $token) {
      _id
    }
  }
`

export default CREATE_ORDER_MUTATION
