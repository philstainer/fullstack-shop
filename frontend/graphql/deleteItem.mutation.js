import gql from 'graphql-tag'

const DELETE_ITEM_MUTATION = gql`
  mutation($id: ID!) {
    deleteItem(id: $id) {
      _id
    }
  }
`

export default DELETE_ITEM_MUTATION
