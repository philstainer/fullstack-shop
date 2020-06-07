import {useQuery, useMutation} from '@apollo/react-hooks'
import {AiOutlineShopping} from 'react-icons/ai'

import ME_QUERY from '#root/graphql/me.query'
import {TOGGLE_CART_MUTATION} from '#root/graphql/localResolvers'

import StyledCart from '#root/components/styles/StyledCart'

const Cart = () => {
  const {data, loading, error} = useQuery(ME_QUERY)
  const [toggleCart] = useMutation(TOGGLE_CART_MUTATION)

  if (loading) return <div>Loading cart...</div>
  if (error) return <div>Failed to load cart...</div>

  const count = data.me.cart.reduce((total, item) => total + item.quantity, 0)

  return (
    <StyledCart title="Open cart" onClick={toggleCart} data-testid="cart">
      <AiOutlineShopping size="2rem" />
      <span data-testid="count">{count}</span>
    </StyledCart>
  )
}

export default Cart
