import merge from 'lodash.merge'

import user from '#root/graphql/loaders/user'
import orderItem from '#root/graphql/loaders/orderItem'
import cartItem from '#root/graphql/loaders/cartItem'

const root = {}

const loaders = merge(root, user, orderItem, cartItem)

export default loaders
