import hasPermission from '#root/utils/hasPermission'

test('should return true on found permissions', () => {
  const user = {
    permissions: ['ADMIN'],
  }

  expect(hasPermission(user, ['ADMIN'])).toBeTruthy()
})

test('should return false on not found permissions', () => {
  const user = {
    permissions: ['USER'],
  }

  expect(hasPermission(user, ['ADMIN'])).toBeFalsy()
})

test('should return false when user has no permissions', () => {
  expect(hasPermission({}, ['ADMIN'])).toBeFalsy()
})
