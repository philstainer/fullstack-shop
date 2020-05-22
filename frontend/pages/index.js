import {useQuery} from '@apollo/react-hooks'
import PropTypes from 'prop-types'

import ITEMS_QUERY from '#root/graphql/items.query'
import StyledItems from '#root/components/styles/StyledItems'
import Item from '#root/components/Item'

const perPage = 4

const Items = ({query}) => {
  const page = parseFloat(query?.page) || 1

  const {data, loading, error} = useQuery(ITEMS_QUERY, {
    variables: {skip: page * perPage - perPage},
  })

  if (loading) return <p>Loading...</p>
  if (error)
    return (
      <p>
        Error:
        {error.message}
      </p>
    )

  return (
    <StyledItems>
      {data.items.map(item => (
        <Item item={item} key={item._id} />
      ))}
    </StyledItems>
  )
}

Items.propTypes = {
  query: PropTypes.shape({
    page: PropTypes.string,
  }),
}

export default Items
