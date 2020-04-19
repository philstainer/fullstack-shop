'use strict'

import {gql} from 'apollo-server-express'

import {dbConnect, dbDisconnect} from '#root/utils/dbConnection'
import {apolloServer, query, mutate} from '#root/utils/createTestClient'

const QUERY = gql`
  {
    me {
      _id
      name
      email
    }
  }
`

beforeAll(async () => await dbConnect())
afterAll(async () => await dbDisconnect())

test.skip('Something', async () => {
  const response = await query({query: QUERY})
})
