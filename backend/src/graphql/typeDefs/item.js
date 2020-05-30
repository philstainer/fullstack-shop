import {gql} from 'apollo-server-express'

const typeDefs = gql`
  extend type Query {
    items(limit: Int, skip: Int): [Item!]
    itemsConnection: ItemsConnection
    item(_id: ID!): Item
  }

  extend type Mutation {
    createItem(
      title: String!
      description: String!
      imageUrl: String!
      price: Int!
    ): Item
    deleteItem(id: ID!): Item!
  }

  type Item {
    _id: ID!
    title: String!
    description: String!
    imageUrl: String!
    price: Int!
    createdBy: User
    updatedBy: User
  }

  type ItemsConnection {
    totalCount: Int
  }
`

export default typeDefs
