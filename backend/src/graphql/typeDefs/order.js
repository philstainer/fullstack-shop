import {gql} from 'apollo-server-express'

const typeDefs = gql`
  extend type Query {
    orders: [Order]!
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
  }
`

export default typeDefs
