'use strict'

import verifyToken from '#root/utils/verifyToken'

jest.mock('jsonwebtoken', () => {
  return {
    verify: jest.fn(() => ({sub: 'abc123'})),
  }
})

afterAll(() => {
  jest.unmock('jsonwebtoken')
})

test('should skip if no token', () => {
  const next = jest.fn()
  const req = {}

  verifyToken(req, {}, next)

  expect(req).toMatchObject({})
  expect(next).toHaveBeenCalled()
})

test('should add userId on req if token', () => {
  const next = jest.fn()
  const req = {cookies: {token: 'abc123'}}

  verifyToken(req, {}, next)

  expect(req).toMatchObject({userId: 'abc123'})
  expect(next).toHaveBeenCalled()
})
