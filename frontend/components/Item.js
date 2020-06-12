import {useQuery} from '@apollo/react-hooks'
import PropTypes from 'prop-types'
import Link from 'next/link'

import ME_QUERY from '#root/graphql/me.query'
import StyledItem from '#root/components/styles/StyledItem'
import RemoveItem from '#root/components/RemoveItem'
import AddToCart from '#root/components/AddToCart'

import formatPrice from '#root/utils/formatPrice'
import hasPermission from '#root/utils/hasPermission'

const Item = ({item, skip}) => {
  const {data, loading} = useQuery(ME_QUERY)

  if (loading) return <p>Loading...</p>

  return (
    <StyledItem>
      {item.imageUrl && <img src={item.imageUrl} alt={item.title} />}

      <h3>{item.title}</h3>
      <p>{item.description}</p>
      <p className="price">{formatPrice(item.price)}</p>

      <div className="actions">
        {hasPermission(data.me, ['ADMIN', 'ITEMUPDATE']) && (
          <Link
            href={{
              pathname: 'update',
              query: {id: item._id},
            }}
          >
            <a>
              Edit{' '}
              <span role="img" aria-label="Edit">
                ✏️
              </span>
            </a>
          </Link>
        )}

        <AddToCart id={item._id} />

        <RemoveItem id={item._id} skip={skip} />
      </div>
    </StyledItem>
  )
}

Item.propTypes = {
  item: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    imageUrl: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
  }).isRequired,
  skip: PropTypes.number.isRequired,
}

export default Item
