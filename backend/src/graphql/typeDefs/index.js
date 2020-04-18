import {gql} from 'apollo-server-express'

const Query = gql`
  type Query {
    _empty: String
  }
`

const typeDefs = [Query]

export default typeDefs
