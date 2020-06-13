import Link from 'next/link'
import {useQuery} from '@apollo/react-hooks'
import {formatDistance} from 'date-fns'

import ORDERS_QUERY from '#root/graphql/orders.query'

import StyledOrders from '#root/components/styles/StyledOrders'
import formatPrice from '#root/utils/formatPrice'

const Orders = () => {
  const {data, loading, error} = useQuery(ORDERS_QUERY)

  if (loading) return <p>Loading orders...</p>
  if (error) return <p>{error.message}</p>

  return (
    <StyledOrders>
      <h2>You have {data.orders.length} orders</h2>

      <ul>
        <li>
          <a>
            <p>Ordered</p>
            <p>Order Number</p>
            <p>Items</p>
            <p>Products</p>
            <p>Total</p>
          </a>
        </li>

        {data.orders.map(order => (
          <li key={order._id} title="View order">
            <Link href={{pathname: '/order', query: {id: order._id}}}>
              <a>
                <p>
                  {formatDistance(new Date(order.createdAt), new Date(), {
                    addSuffix: true,
                  })}
                </p>
                <p>
                  <strong>{order._id}</strong>
                </p>
                <p>{order.items.reduce((a, b) => a + b.quantity, 0)}</p>
                <p>{order.items.length}</p>
                <p>{formatPrice(order.total)}</p>
              </a>
            </Link>
          </li>
        ))}
      </ul>
    </StyledOrders>
  )
}

export default Orders
