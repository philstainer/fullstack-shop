import {useQuery, useMutation} from '@apollo/react-hooks'
import PropTypes from 'prop-types'

import ME_QUERY from '#root/graphql/me.query'
import DELETE_ITEM_MUTATION from '#root/graphql/deleteItem.mutation'
import ITEMS_QUERY from '#root/graphql/items.query'
import ITEMS_CONNECTION_QUERY from '#root/graphql/itemsConnection.query'

import hasPermission from '#root/utils/hasPermission'

const RemoveItem = ({id, skip}) => {
  const {data, loading} = useQuery(ME_QUERY)

  const update = (cache, payload) => {
    const data = cache.readQuery({query: ITEMS_CONNECTION_QUERY})

    data.itemsConnection = {
      ...data.itemsConnection,
      totalCount: data.itemsConnection.totalCount - 1,
    }

    cache.writeQuery({query: ITEMS_CONNECTION_QUERY, data})
  }

  const [deleteItem] = useMutation(DELETE_ITEM_MUTATION, {
    variables: {id},
    refetchQueries: [{query: ITEMS_QUERY, variables: {skip, limit: 4}}],
    awaitRefetchQueries: true,
    update,
  })

  const handleRemoveItem = async () => {
    // eslint-disable-next-line
    if (!confirm('Are you sure you want to delete this item?')) return

    try {
      await deleteItem()
    } catch (err) {}
  }

  if (!hasPermission(data?.me, ['ADMIN', 'ITEMDELETE'])) return null

  return (
    <button className="remove" type="button" onClick={handleRemoveItem}>
      Delete This Item
    </button>
  )
}

RemoveItem.propTypes = {
  id: PropTypes.string.isRequired,
  skip: PropTypes.number.isRequired,
}

export default RemoveItem
