import merge from 'lodash.merge'

import user from '#root/graphql/resolvers/user'
import item from '#root/graphql/resolvers/item'

const root = {}

const resolvers = merge(root, user, item)

export default resolvers
