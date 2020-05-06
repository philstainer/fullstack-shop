import {ApolloServer} from 'apollo-server-express'

import schema from '#root/graphql/schema'
import context from '#root/graphql/context'
import formatError from '#root/graphql/formatError'

const isProduction = process.env.NODE_ENV === 'production'

const apolloServer = new ApolloServer({
  formatError,
  schema,
  context,
  playground: !isProduction,
})

export default apolloServer
