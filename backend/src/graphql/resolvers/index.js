import merge from 'lodash.merge'

import user from '#root/graphql/resolvers/user'

const root = {}

const resolvers = merge(root, user)

export default resolvers
