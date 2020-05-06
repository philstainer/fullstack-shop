import {makeExecutableSchema} from 'apollo-server-express'

import resolvers from '#root/graphql/resolvers'
import typeDefs from '#root/graphql/typeDefs'

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
})

export default schema
