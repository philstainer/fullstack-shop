import PropTypes from 'prop-types'
import {AiOutlineClose} from 'react-icons/ai'
import {useMutation} from '@apollo/react-hooks'

import ME_QUERY from '#root/graphql/me.query'
import REMOVE_CART_ITEM_MUTATION from '#root/graphql/removeCartItem.mutation'

import StyledRemoveCartItem from '#root/components/styles/StyledRemoveCartItem'

const RemoveFromCart = ({id}) => {
  const update = (cache, payload) => {
    const removeItemId = payload.data.removeFromCart._id

    let data = cache.readQuery({query: ME_QUERY})

    const cart = data.me.cart.filter(item => item._id !== removeItemId)

    data = {me: {...data.me, cart}}

    cache.writeQuery({query: ME_QUERY, data})
  }

  const [removeCartItem, {loading}] = useMutation(REMOVE_CART_ITEM_MUTATION, {
    variables: {id},
    update,
  })

  return (
    <StyledRemoveCartItem
      type="button"
      title="Delete Item"
      onClick={removeCartItem}
      disabled={loading}
      data-testid="removeCartItem"
    >
      <AiOutlineClose size="2rem" />
    </StyledRemoveCartItem>
  )
}

RemoveFromCart.propTypes = {
  id: PropTypes.string.isRequired,
}

export default RemoveFromCart
