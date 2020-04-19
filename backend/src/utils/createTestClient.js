'use strict'

import {createTestClient} from 'apollo-server-testing'

import apolloServer from '#root/graphql/apolloServer'

// apolloServer.context = () => ({bearerToken: `Bearer <token>`})

const {query, mutate} = createTestClient(apolloServer)

export {apolloServer, query, mutate}
