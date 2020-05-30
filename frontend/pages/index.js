import {useQuery} from '@apollo/react-hooks'
import PropTypes from 'prop-types'

import ITEMS_QUERY from '#root/graphql/items.query'
import StyledItems from '#root/components/styles/StyledItems'
import Item from '#root/components/Item'
import Pagination from '#root/components/Pagination'

const perPage = 4

const Items = ({query}) => {
  const page = parseFloat(query?.page) || 1

  const {data, loading, error} = useQuery(ITEMS_QUERY, {
    variables: {skip: page * perPage - perPage, limit: perPage},
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
    <>
      <Pagination page={page} />

      <StyledItems>
        {data.items.map(item => (
          <Item item={item} key={item._id} />
        ))}
      </StyledItems>

      <Pagination page={page} />
    </>
  )
}

Items.propTypes = {
  query: PropTypes.shape({
    page: PropTypes.string,
  }),
}

export default Items
