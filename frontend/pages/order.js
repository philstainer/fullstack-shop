import PropTypes from 'prop-types'
import {useQuery} from '@apollo/react-hooks'
import Head from 'next/head'
import {format} from 'date-fns'

import ORDER_QUERY from '#root/graphql/order.query'

import StyledOrder from '#root/components/styles/StyledOrder'

import formatPrice from '#root/utils/formatPrice'

const Order = ({query: {id}}) => {
  const {data, loading, error} = useQuery(ORDER_QUERY, {variables: {id}})

  if (error) return <p>{error.message}</p>
  if (loading) return <p>Loading...</p>

  const {order} = data

  return (
    <StyledOrder data-testid="order">
      <Head>
        <title>Fullstack shop - Order {id}</title>
      </Head>

      <p>
        <span>Order ID:</span>
        <span>{order._id}</span>
      </p>

      <p>
        <span>Charge</span>
        <span>{order.charge}</span>
      </p>

      <p>
        <span>Date</span>
        <span>{format(new Date(order.createdAt), 'MMMM d, yyyy h:mm a')}</span>
      </p>

      <p>
        <span>Order Total</span>
        <span>{formatPrice(order.total)}</span>
      </p>

      <p>
        <span>Item Count</span>
        <span>{order.items.length}</span>
      </p>

      <div className="items">
        {order.items.map(item => (
          <div className="order-item" key={item._id}>
            <img src={item.imageUrl} alt={item.title} />
            <div className="item-details">
              <h2>{item.title}</h2>
              <p>
                {item.quantity} x {formatPrice(item.price)} ={' '}
                {formatPrice(item.price * item.quantity)}
              </p>
              <p>{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </StyledOrder>
  )
}

Order.propTypes = {
  query: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }).isRequired,
}

export default Order
