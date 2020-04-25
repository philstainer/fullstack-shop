'use strict'

import formatError from '#root/graphql/formatError'

const NODE_ENV = process.env.NODE_ENV

afterEach(() => {
  process.env.NODE_ENV = NODE_ENV
})

test('return formatted validation errors', () => {
  const error = {
    message: 'Fake error message',
    extensions: {
      exception: {
        details: [
          {message: 'password wrong', context: {key: 'password'}},
          {message: 'username wrong', context: {key: 'username'}},
        ],
        stacktrace: ['ValidationError: Error'],
      },
    },
  }

  const expectedError = [
    {key: 'password', message: 'password wrong'},
    {key: 'username', message: 'username wrong'},
  ]

  expect(formatError(error)).toMatchObject(expectedError)
})

test('return full error if not in production', async () => {
  process.env.NODE_ENV = 'production'

  const error = {
    message: 'Fake error message',
    extensions: {
      exception: {
        details: [],
        stacktrace: ['Some error: Error'],
      },
    },
  }

  const expectedError = {
    status: 'Error',
    message: 'Internal Server Error',
  }

  expect(formatError(error)).toMatchObject(expectedError)
})

test('return full error if not in production', () => {
  const error = {
    message: 'Fake error message',
    extensions: {
      exception: {
        details: [],
        stacktrace: ['Some error: Error'],
      },
    },
  }

  expect(formatError(error)).toMatchObject(error)
})
