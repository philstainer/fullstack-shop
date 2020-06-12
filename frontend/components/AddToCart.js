import PropTypes from 'prop-types'
import {useMutation} from '@apollo/react-hooks'

import ME_QUERY from '#root/graphql/me.query'
import ADD_TO_CART_MUTATION from '#root/graphql/addToCart.mutation'

const AddToCart = ({id}) => {
  const [addToCart, {loading}] = useMutation(ADD_TO_CART_MUTATION, {
    variables: {id},
    refetchQueries: [{query: ME_QUERY}],
    awaitRefetchQueries: true,
  })

  return (
    <button
      className="add"
      type="button"
      title="Add To Cart"
      onClick={addToCart}
      disabled={loading}
    >
      Add{loading && 'ing'} To Cart 🛒
    </button>
  )
}

AddToCart.propTypes = {
  id: PropTypes.string.isRequired,
}

export default AddToCart
