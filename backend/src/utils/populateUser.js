'use strict'

import {user} from '#root/models'

const populateUser = async (req, res, next) => {
  if (req?.userId) {
    const foundUser = await user
      .findById(req.userId)
      .select('_id name email confirmed permissions')
      .lean()

    if (!foundUser) {
      res.clearCookie('token')

      return next()
    }

    req.user = foundUser
  }

  next()
}

export default populateUser
