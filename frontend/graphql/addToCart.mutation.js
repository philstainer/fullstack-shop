import gql from 'graphql-tag'

const ADD_TO_CART_MUTATION = gql`
  mutation($id: ID!) {
    addToCart(id: $id) {
      _id
      quantity
      item {
        _id
        title
        description
        imageUrl
        price
      }
    }
  }
`

export default ADD_TO_CART_MUTATION
