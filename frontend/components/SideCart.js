import {useQuery, useMutation} from '@apollo/react-hooks'
import {AiOutlineClose} from 'react-icons/ai'

import ME_QUERY from '#root/graphql/me.query'
import {
  CART_OPEN_QUERY,
  TOGGLE_CART_MUTATION,
} from '#root/graphql/localResolvers'

import formatPrice from '#root/utils/formatPrice'
import calcTotalPrice from '#root/utils/calcTotalPrice'

import StyledSideCart from '#root/components/styles/StyledSideCart'
import CartItem from '#root/components/CartItem'
import StripeCheckout from '#root/components/StripeCheckout'

const SideCart = () => {
  const {data, loading, error} = useQuery(ME_QUERY)
  const {data: local} = useQuery(CART_OPEN_QUERY)
  const [toggleCart] = useMutation(TOGGLE_CART_MUTATION)

  if (loading || error || !data.me) return null

  const {me} = data

  return (
    <StyledSideCart open={local.cartOpen} data-testid="cart">
      <header>
        <AiOutlineClose
          title="Close"
          size="4rem"
          className="close"
          onClick={toggleCart}
          data-testid="close"
        />

        <h2>
          {me.name}
          &apos;s Cart
        </h2>

        <p>
          Total of {me.cart.length} Item{me.cart.length === 1 ? '' : "'s"} in
          your cart.
        </p>
      </header>

      <ul>
        {me.cart.map(cartItem => (
          <CartItem key={cartItem._id} cartItem={cartItem} />
        ))}
      </ul>

      <footer>
        <p>{formatPrice(calcTotalPrice(me.cart))}</p>

        <StripeCheckout>
          <button>Checkout</button>
        </StripeCheckout>
      </footer>
    </StyledSideCart>
  )
}

export default SideCart
