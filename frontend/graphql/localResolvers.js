import gql from 'graphql-tag'

export const typeDefs = gql`
  extend type Query {
    authModal: Number
  }

  extend type Mutation {
    toggleAuthModal: Number
  }
`

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

export const TOGGLE_CART_MUTATION = gql`
  mutation {
    toggleCart @client
  }
`

export const CART_OPEN_QUERY = gql`
  query {
    cartOpen @client
  }
`

export const resolvers = {
  Mutation: {
    toggleAuthModal: (root, variables, {cache}) => {
      const currentState = cache.readQuery({query: AUTH_MODAL_QUERY})

      cache.writeData({
        data: {authModal: currentState.authModal === null ? 0 : null},
      })

      return null
    },
    toggleCart: (root, variables, {cache}) => {
      const {cartOpen} = cache.readQuery({
        query: CART_OPEN_QUERY,
      })

      const data = {
        data: {cartOpen: !cartOpen},
      }

      cache.writeData(data)

      return data
    },
  },
}
