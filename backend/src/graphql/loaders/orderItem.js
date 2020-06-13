import DataLoader from 'dataloader'

import orderItem from '#root/models/orderItem'

const loaders = {
  orderItems: new DataLoader(async ids => {
    const rows = await orderItem
      .find({order: {$in: ids}})
      .select('_id title description imageUrl price quantity order')
      .lean()

    const lookup = rows.reduce((acc, row) => {
      if (acc[row.order]) {
        acc[row.order] = [...acc[row.order], row]
      } else {
        acc[row.order] = [row]
      }

      return acc
    }, {})

    return ids.map(id => lookup[id] || null)
  }),
}

export default loaders
