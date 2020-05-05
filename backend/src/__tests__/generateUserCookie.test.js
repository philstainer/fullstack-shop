import generateUserCookie from '#root/utils/generateUserCookie'

test('sets current user cookie', () => {
  const user = {_id: 12345}
  const ctx = {
    res: {
      cookie: jest.fn(),
    },
  }

  generateUserCookie(user, ctx)

  expect(ctx.res.cookie).toHaveBeenCalledTimes(1)
})
