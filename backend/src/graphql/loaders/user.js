import DataLoader from 'dataloader'

import user from '#root/models/user'

const loaders = {
  users: new DataLoader(async ids => {
    const rows = await user
      .find({_id: {$in: ids}})
      .select('_id name email confirmed permissions')
      .lean()

    const lookup = rows.reduce((acc, row) => {
      acc[row._id] = row

      return acc
    }, {})

    return ids.map(id => lookup[id] || null)
  }),
}

export default loaders
