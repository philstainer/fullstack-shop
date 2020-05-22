import {useQuery} from '@apollo/react-hooks'
import PropTypes from 'prop-types'
import Link from 'next/link'

import ME_QUERY from '#root/graphql/me.query'
import StyledItem from '#root/components/styles/StyledItem'
import formatPrice from '#root/utils/formatPrice'
import hasPermission from '#root/utils/hasPermission'

const Item = ({item}) => {
  const {data, loading} = useQuery(ME_QUERY)

  if (loading) return <p>Loading...</p>

  return (
    <Link
      href={{
        pathname: '/item',
        query: {id: item._id},
      }}
    >
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

          <button className="add" type="button">
            Add to cart
          </button>

          {hasPermission(data.me, ['ADMIN', 'ITEMDELETE']) && (
            <button className="remove" type="button">
              Delete This Item
            </button>
          )}
        </div>
      </StyledItem>
    </Link>
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
}

export default Item
