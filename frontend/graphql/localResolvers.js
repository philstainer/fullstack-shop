import gql from 'graphql-tag'

export const typeDefs = gql`
  extend type Query {
    authModal: Number
  }

  extend type Mutation {
    toggleAuthModal: Number
  }
`

export const resolvers = {
  Mutation: {
    toggleAuthModal: (root, variables, {cache}, info) => {
      const currentState = cache.readQuery({query: AUTH_MODAL_QUERY})

      const nextState = currentState.authModal === null ? 0 : null

      cache.writeData({data: {authModal: nextState}})

      return nextState
    },
  },
}

export const AUTH_MODAL_QUERY = gql`
  query authModal {
    authModal @client
  }
`

export const AUTH_MODAL_MUTATION = gql`
  mutation toggleAuthModal {
    toggleAuthModal @client
  }
`
