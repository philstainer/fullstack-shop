import {ApolloServer} from 'apollo-server-express'

import schema from '#root/graphql/schema'
import context from '#root/graphql/context'
import formatError from '#root/graphql/formatError'
import accessEnv from '#root/utils/accessEnv'

const isProduction = accessEnv('NODE_ENV') === 'production'

const apolloServer = new ApolloServer({
  formatError,
  schema,
  context,
  playground: !isProduction,
})

export default apolloServer
