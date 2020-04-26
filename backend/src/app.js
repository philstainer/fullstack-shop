'use strict'

import cookieParser from 'cookie-parser'
import express from 'express'
import cors from 'cors'

import verifyToken from '#root/utils/verifyToken'
import apolloServer from '#root/graphql/apolloServer'

const isProduction = process.env.NODE_ENV === 'production'

const app = express()

// Setup logging and debug mode
if (!isProduction) {
  app.use(require('morgan')('dev'))
  require('mongoose').set('debug', true)
}

app.use(cookieParser())

app.use(verifyToken)

app.use(cors({credentials: true, origin: process.env.FRONTEND_URL}))

apolloServer.applyMiddleware({app, cors: false, path: '/graphql'})

module.exports = app
