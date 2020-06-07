import {ApolloClient} from 'apollo-client'
import {InMemoryCache} from 'apollo-cache-inmemory'
import withApollo from 'next-with-apollo'
import {createHttpLink} from 'apollo-link-http'
import fetch from 'isomorphic-unfetch'

import {typeDefs, resolvers} from '#root/graphql/localResolvers'

const GRAPHQL_URL = `${process.env.BACKEND_URL}/graphql`

const link = createHttpLink({
  fetch,
  uri: GRAPHQL_URL,
  credentials: 'include',
})

const client = ({initialState}) => {
  const cache = new InMemoryCache().restore(initialState || {})

  cache.writeData({
    data: {
      authModal: null,
      cartOpen: false,
    },
  })

  return new ApolloClient({
    link,
    cache,
    typeDefs,
    resolvers,
  })
}

export default withApollo(client)
