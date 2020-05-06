import mongoose from 'mongoose'

const dbConnect = () =>
  mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })

const dbDisconnect = mongoose.disconnect

export {dbConnect, dbDisconnect}
