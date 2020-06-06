import {gql} from 'apollo-server-express'

const typeDefs = gql`
  extend type Query {
    me: User
  }

  extend type Mutation {
    signUp(
      name: String!
      email: String!
      password: String!
      confirmPassword: String!
    ): User!
    signOut: Status
    signIn(email: String!, password: String!): User!
    confirmAccount(confirmToken: String!): Status
    requestConfirm: Status
    requestReset(email: String!): Status
    resetPassword(
      resetToken: String!
      password: String!
      confirmPassword: String!
    ): User
    changePassword(
      currentPassword: String!
      password: String!
      confirmPassword: String!
    ): Status
    changeEmail(
      password: String!
      email: String!
      confirmEmail: String!
    ): Status
    addToCart(id: ID!): CartItem
    removeFromCart(id: ID!): CartItem
  }

  type User {
    _id: ID!
    name: String!
    email: String!
    confirmed: Boolean!
    permissions: [String!]
    cart: [CartItem!]!
  }

  type CartItem {
    _id: ID!
    quantity: Int!
    item: Item
  }
`

export default typeDefs
