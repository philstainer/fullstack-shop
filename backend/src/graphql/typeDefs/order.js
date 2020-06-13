import {gql} from 'apollo-server-express'

const typeDefs = gql`
  extend type Query {
    orders: [Order]!
    order(id: ID!): Order
  }

  extend type Mutation {
    createOrder(token: String!): Order!
  }

  type OrderItem {
    _id: ID!
    title: String!
    description: String!
    imageUrl: String!
    price: Int!
    quantity: Int!
  }

  type Order {
    _id: ID!
    items: [OrderItem!]!
    total: Int!
    charge: String!
    user: User!
    createdAt: DateTime!
    updatedAt: DateTime!
  }
`

export default typeDefs
