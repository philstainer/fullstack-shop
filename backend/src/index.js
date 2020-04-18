import '@babel/polyfill'

// Programming error
process.on('uncaughtException', (err) => {
  console.log('UNHANDLED EXCEPTION! 💥 Shutting down...')
  console.log(err.name, err.message)

  process.exit(1)
})

import mongoose from 'mongoose'

import app from '#root/app'

let server

  // prettier-ignore
;(async () => {
  await mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })

  server = await app.listen(process.env.BACKEND_PORT)

  console.log(
    `Server listening on port http://localhost:${server?.address()?.port}`,
  )
})()

const shutdown = async () => {
  await server?.close()

  await mongoose?.disconnect()

  process.exit(1)
}

// Error 3rd party
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...')
  console.log(err.name, err.message)

  shutdown()
})
