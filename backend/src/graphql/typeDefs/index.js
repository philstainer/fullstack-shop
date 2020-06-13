import {gql} from 'apollo-server-express'

import user from '#root/graphql/typeDefs/user'
import item from '#root/graphql/typeDefs/item'
import order from '#root/graphql/typeDefs/order'

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

const typeDefs = [root, user, item, order]

export default typeDefs
