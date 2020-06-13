import PropTypes from 'prop-types'
import StripeCheckout from 'react-stripe-checkout'
import {useQuery, useMutation} from '@apollo/react-hooks'
import Router from 'next/router'

import {TOGGLE_CART_MUTATION} from '#root/graphql/localResolvers'
import ME_QUERY from '#root/graphql/me.query'
import CREATE_ORDER_MUTATION from '#root/graphql/createOrder.mutation'

import calcTotalPrice from '#root/utils/calcTotalPrice'

function totalItems(cart) {
  return cart.reduce((total, item) => total + item.quantity, 0)
}

const StripeCheckoutWrapper = ({children}) => {
  const {
    data: {me},
    loading,
  } = useQuery(ME_QUERY)
  const [toggleCart] = useMutation(TOGGLE_CART_MUTATION)
  const [createOrder] = useMutation(CREATE_ORDER_MUTATION, {
    refetchQueries: [{query: ME_QUERY}],
    awaitRefetchQueries: true,
  })

  const handleToken = async res => {
    try {
      const order = await createOrder({variables: {token: res.id}})

      toggleCart()

      Router.push({
        pathname: '/order',
        query: {id: order.data.createOrder._id},
      })
    } catch (error) {}
  }

  if (loading) return null
  if (me.cart.length === 0) return null

  return (
    <StripeCheckout
      amount={calcTotalPrice(me.cart)}
      name="Fullstack shop"
      description={`Order of ${totalItems(me.cart)} items!`}
      image={me?.cart[0]?.item?.imageUrl}
      stripeKey={process.env.STRIPE_PUBLIC}
      currency="GBP"
      email={me.email}
      token={handleToken}
    >
      {children}
    </StripeCheckout>
  )
}

StripeCheckoutWrapper.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
}

export default StripeCheckoutWrapper
