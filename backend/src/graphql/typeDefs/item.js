import {gql} from 'apollo-server-express'

const typeDefs = gql`
  extend type Query {
    items(limit: Int, skip: Int): [Item!]
    item(_id: ID!): Item
  }

  extend type Mutation {
    createItem(
      title: String!
      description: String!
      imageUrl: String!
      price: Int!
    ): Item
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
`

export default typeDefs
