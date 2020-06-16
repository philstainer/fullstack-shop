'use strict'

import jwt from 'jsonwebtoken'

import accessEnv from '#root/utils/accessEnv'

const verifyToken = (req, res, next) => {
  const token = req?.cookies?.token

  if (token) {
    const {sub} = jwt.verify(token, accessEnv('JWT_SECRET'))

    req.userId = sub
  }

  next()
}

export default verifyToken
