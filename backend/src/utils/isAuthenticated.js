'use strict'

const isAuthenticated = (ctx) => {
  if (!ctx?.req?.userId) throw new Error('You must be logged in to do that!')
}

export default isAuthenticated
