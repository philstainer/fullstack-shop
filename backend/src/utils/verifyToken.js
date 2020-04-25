'use strict'

import jwt from 'jsonwebtoken'

const verifyToken = (req, res, next) => {
  const token = req?.cookies?.token

  if (token) {
    const {sub} = jwt.verify(token, process.env.JWT_SECRET)

    req.userId = sub
  }

  next()
}

export default verifyToken
