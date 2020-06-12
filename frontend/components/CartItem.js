import PropTypes from 'prop-types'

import formatPrice from '#root/utils/formatPrice'
import RemoveFromCart from '#root/components/RemoveFromCart'
import StyledCartItem from '#root/components/styles/StyledCartItem'

const CartItem = ({cartItem}) => {
  if (!cartItem.item)
    return (
      <StyledCartItem>
        <p>This Item has been removed</p>
        <RemoveFromCart id={cartItem._id} />
      </StyledCartItem>
    )

  return (
    <StyledCartItem>
      <img
        src={cartItem.item.imageUrl}
        alt={cartItem.item.title}
        data-testid="img"
      />

      <div className="cart-item-details">
        <h3 data-testid="title">{cartItem.item.title}</h3>

        <p>
          {formatPrice(cartItem.item.price * cartItem.quantity)}
          {' - '}
          <em>
            {cartItem.quantity} &times; {formatPrice(cartItem.item.price)} each
          </em>
        </p>
      </div>

      <RemoveFromCart id={cartItem._id} />
    </StyledCartItem>
  )
}

CartItem.propTypes = {
  cartItem: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    quantity: PropTypes.number.isRequired,
    item: PropTypes.shape({
      _id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      imageUrl: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
    }),
  }).isRequired,
}

export default CartItem
