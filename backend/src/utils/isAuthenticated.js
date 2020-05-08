'use strict'

import {AuthenticationError} from 'apollo-server-express'

const isAuthenticated = ctx => {
  if (!ctx?.req?.userId)
    throw new AuthenticationError('You must be logged in to do that!')
}

export default isAuthenticated
