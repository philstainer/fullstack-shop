'use strict'

import graphqlCall from '#root/utils/graphqlCall'

const SIGNOUT_MUTATION = `
  mutation {
    signOut {
      status
      message
    }
  }
`
test('throws error when not signed in', async () => {
  const clearCookie = jest.fn()

  const context = {
    req: {},
    res: {
      clearCookie,
    },
  }

  const {errors} = await graphqlCall(SIGNOUT_MUTATION, context, null)

  expect(clearCookie).not.toHaveBeenCalledWith('token')
  expect(errors[0].message).toMatch(/must be logged in/i)
})

test('successfully signs out', async () => {
  const clearCookie = jest.fn()

  const context = {
    req: {userId: 'abc123'},
    res: {
      clearCookie,
    },
  }

  const {data} = await graphqlCall(SIGNOUT_MUTATION, context, null)

  expect(clearCookie).toHaveBeenCalledWith('token')
  expect(data.signOut).toHaveProperty('status', 'Success')
  expect(data.signOut).toHaveProperty('message', 'See you soon')
})
