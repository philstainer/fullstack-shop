'use strict'

import '@babel/polyfill'
import {dbConnect, dbDisconnect} from '#root/utils/dbConnection'

// Programming error
process.on('uncaughtException', err => {
  console.log('UNHANDLED EXCEPTION! 💥 Shutting down...')
  console.log(err.name, err.message)

  process.exit(1)
})

import app from '#root/app'

let server

  // prettier-ignore
;(async () => {
  await dbConnect()

  server = await app.listen(process.env.BACKEND_PORT)

  console.log(
    `Server listening on port http://localhost:${
      server?.address()?.port
    }/graphql`,
  )
})()

const shutdown = async () => {
  await server?.close()

  await dbDisconnect()

  process.exit(1)
}

// Error 3rd party
process.on('unhandledRejection', err => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...')
  console.log(err.name, err.message)

  shutdown()
})
