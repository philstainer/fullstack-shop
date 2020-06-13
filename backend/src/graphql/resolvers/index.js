import merge from 'lodash.merge'

import user from '#root/graphql/resolvers/user'
import item from '#root/graphql/resolvers/item'
import order from '#root/graphql/resolvers/order'

const root = {}

const resolvers = merge(root, user, item, order)

export default resolvers
