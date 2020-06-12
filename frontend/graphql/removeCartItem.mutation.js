import gql from 'graphql-tag'

const REMOVE_CART_ITEM_MUTATION = gql`
  mutation($id: ID!) {
    removeFromCart(id: $id) {
      _id
    }
  }
`

export default REMOVE_CART_ITEM_MUTATION
