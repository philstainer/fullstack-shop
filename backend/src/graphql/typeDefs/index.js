'use strict'

import {gql} from 'apollo-server-express'
import user from '#root/graphql/typeDefs/user'

const root = gql`
  type Query {
    _empty: String
  }

  type Mutation {
    _empty: String
  }

  type Status {
    status: String
    message: String
  }
`

const typeDefs = [root, user]

export default typeDefs
