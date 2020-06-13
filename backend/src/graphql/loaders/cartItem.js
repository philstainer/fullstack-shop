import DataLoader from 'dataloader'

import cartItem from '#root/models/cartItem'

const loaders = {
  cartItems: new DataLoader(async ids => {
    const rows = await cartItem
      .find({user: {$in: ids}})
      .select('_id quantity user item')
      .lean()
      .populate('item')

    const lookup = rows.reduce((acc, row) => {
      if (acc[row.user]) {
        acc[row.user] = [...acc[row.user], row]
      } else {
        acc[row.user] = [row]
      }

      return acc
    }, {})

    return ids.map(id => lookup[id] || [])
  }),
}

export default loaders
