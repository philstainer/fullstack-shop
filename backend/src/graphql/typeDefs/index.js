'use strict'

import {gql} from 'apollo-server-express'

const Query = gql`
  type Query {
    _empty: String
    me: User
  }

  type User {
    _id: ID!
    name: String!
    email: String!
  }
`

const typeDefs = [Query]

export default typeDefs
