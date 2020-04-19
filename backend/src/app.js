'use strict'

import cookieParser from 'cookie-parser'
import express from 'express'
import cors from 'cors'

import apolloServer from '#root/graphql/apolloServer'

// import formatGraphQLErrors from '#root/helpers/formatGraphQLErrors'

const isProduction = process.env.NODE_ENV === 'production'

const app = express()

// Setup logging and debug mode
if (!isProduction) {
  app.use(require('morgan')('dev'))
  require('mongoose').set('debug', true)
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
