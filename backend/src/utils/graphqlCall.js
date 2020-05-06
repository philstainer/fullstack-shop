// eslint-disable-next-line import/no-extraneous-dependencies
import {graphql} from 'graphql'
import {makeExecutableSchema} from 'apollo-server-express'
import merge from 'lodash.merge'
import resolvers from '#root/graphql/resolvers'
import typeDefs from '#root/graphql/typeDefs'

import * as models from '#root/models'

const schema = makeExecutableSchema({typeDefs, resolvers})

const graphqlCall = (query, context = {}, variables = {}) => {
  const mergedContext = merge(context, {db: models})

  return graphql(schema, query, null, mergedContext, variables)
}

export default graphqlCall
