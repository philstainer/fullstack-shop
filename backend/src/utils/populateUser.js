'use strict'

import {user} from '#root/models'

const populateUser = async (req, res, next) => {
  if (req?.userId) {
    const foundUser = await user
      .findById(req.userId)
      .select('_id name email permissions')
      .lean()

    if (!foundUser) throw new Error('Unable to populate user')

    req.user = foundUser
  }

  next()
}

export default populateUser
