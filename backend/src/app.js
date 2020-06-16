import cookieParser from 'cookie-parser'
import express from 'express'
import cors from 'cors'

import verifyToken from '#root/utils/verifyToken'
import populateUser from '#root/utils/populateUser'
import apolloServer from '#root/graphql/apolloServer'

const isProduction = process.env.NODE_ENV === 'production'

const app = express()

// Setup logging and debug mode
if (!isProduction) {
  // eslint-disable-next-line
  app.use(require('morgan')('dev'))

  // eslint-disable-next-line
  require('mongoose').set('debug', true)
}

app.use(cookieParser())

app.use(verifyToken)

app.use(populateUser)

app.use(cors({credentials: true, origin: process.env.FRONTEND_URL}))

apolloServer.applyMiddleware({app, cors: false, path: '/graphql'})

export default app
