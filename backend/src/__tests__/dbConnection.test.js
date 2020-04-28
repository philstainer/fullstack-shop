'use strict'

import mongoose from 'mongoose'

import {dbConnect, dbDisconnect} from '#root/utils/dbConnection'

// Mongoose Ready States
// 0: disconnected
// 1: connected
// 2: connecting
// 3: disconnecting

test('initial state should be disconnected', () => {
  expect(mongoose.connection.readyState).toBe(0)
})

test('should connect / disconnect from database', async () => {
  await dbConnect()

  expect(mongoose.connection.readyState).toBe(1)

  await dbDisconnect()

  expect(mongoose.connection.readyState).toBe(0)
})
