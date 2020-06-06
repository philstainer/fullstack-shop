import gql from 'graphql-tag'

const UPDATE_ITEM_MUTATION = gql`
  mutation(
    $id: ID!
    $title: String
    $description: String
    $imageUrl: String
    $price: Int
  ) {
    updateItem(
      id: $id
      title: $title
      description: $description
      imageUrl: $imageUrl
      price: $price
    ) {
      _id
      title
      description
      imageUrl
      price
    }
  }
`

export default UPDATE_ITEM_MUTATION
