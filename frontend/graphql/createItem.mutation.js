import gql from 'graphql-tag'

const CREATE_ITEM_MUTATION = gql`
  mutation(
    $title: String!
    $description: String!
    $imageUrl: String!
    $price: Int!
  ) {
    createItem(
      title: $title
      description: $description
      imageUrl: $imageUrl
      price: $price
    ) {
      _id
    }
  }
`

export default CREATE_ITEM_MUTATION
