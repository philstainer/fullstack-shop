import mongoose from 'mongoose'
import {MongoMemoryServer} from 'mongodb-memory-server'

const mongod = new MongoMemoryServer()

process.env.MAIL_HOST = ''
process.env.MAIL_PORT = ''
process.env.MAIL_USER = ''
process.env.MAIL_PASS = ''
process.env.STRIPE_SECRET = ''
process.env.JWT_SECRET = 'SECRET'

// Connect to the in-memory database.
export const connect = async () => {
  const uri = await mongod.getConnectionString()

  const mongooseOpts = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  }

  await mongoose.connect(uri, mongooseOpts)
}

// Drop database, close the connection and stop mongod.
export const closeDatabase = async () => {
  await mongoose.connection.dropDatabase()
  await mongoose.connection.close()
  await mongod.stop()
}

// Remove all the data for all db collections.
export const clearDatabase = async () => {
  const collections = mongoose.connection.collections

  for (const key in collections) {
    const collection = collections[key]
    await collection.deleteMany()
  }
}
