import hasPermission from '#root/utils/hasPermission'

const neededPermissions = ['ADMIN']

test('throws error when permissions not found', () => {
  const user = {
    permissions: [],
  }

  expect(() => hasPermission(user, neededPermissions)).toThrowError(
    /sufficient permissions/i,
  )
})

test('does not throw error when permissions found', () => {
  const user = {
    permissions: ['ADMIN'],
  }

  expect(() => hasPermission(user, neededPermissions)).not.toThrowError(
    /sufficient permissions/i,
  )
})
