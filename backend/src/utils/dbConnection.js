import mongoose from 'mongoose'

import accessEnv from '#root/utils/accessEnv'

export const dbConnect = () =>
  mongoose.connect(accessEnv('MONGO_URL'), {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })

export const dbDisconnect = mongoose.disconnect
