import {gql} from 'apollo-server-express'

import user from '#root/graphql/typeDefs/user'
import item from '#root/graphql/typeDefs/item'

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

const typeDefs = [root, user, item]

export default typeDefs
