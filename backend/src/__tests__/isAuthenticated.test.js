import isAuthenticated from '#root/utils/isAuthenticated'

test('throws error if not authenticated', () => {
  expect(isAuthenticated).toThrowError(/logged in/i)
})

test('does not throw error if authenticated', () => {
  const ctx = {req: {userId: 'abc123'}}

  expect(() => isAuthenticated(ctx)).not.toThrowError()
})
