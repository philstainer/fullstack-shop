'use strict'

const validationError = (error) => {
  return (
    error?.extensions?.exception?.details.map((detail) => ({
      key: detail.context.key,
      message: detail.message,
    })) || 'Internal Server Error'
  )
}

const formatError = (error) => {
  const stackTrace = error?.extensions?.exception?.stacktrace[0]

  if (stackTrace.startsWith('ValidationError:')) return validationError(error)

  if (process.env.NODE_ENV === 'production')
    return {status: 'Error', message: 'Internal Server Error'}

  return error
}

export default formatError
