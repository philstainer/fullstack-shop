import {ApolloServer} from 'apollo-server-express'
import cookieParser from 'cookie-parser'
import express from 'express'
import cors from 'cors'

import schema from '#root/graphql/schema'
import context from '#root/graphql/context'

// import formatGraphQLErrors from '#root/helpers/formatGraphQLErrors'

const apolloServer = new ApolloServer({
  // formatError: formatGraphQLErrors,
  schema,
  context,
})

const app = express()

// Only use morgan in development
if (process.env.NODE_ENV !== 'development') {
  app.use(require('morgan')('dev'))
}

app.use(cookieParser())

app.use(
  cors({
    credentials: true,
    origin: `http://localhost:${process.env.FRONTEND_PORT}`,
  }),
)

apolloServer.applyMiddleware({app, cors: false, path: '/graphql'})

module.exports = app
