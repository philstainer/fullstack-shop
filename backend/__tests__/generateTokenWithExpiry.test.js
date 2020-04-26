import generateTokenWithExpiry from '#root/utils/generateTokenWithExpiry'

test('returns token and expiry', async () => {
  jest.spyOn(Date, 'now').mockImplementationOnce(() => 1587894144030)

  const {token, tokenExpiry} = await generateTokenWithExpiry(3600000)

  expect(tokenExpiry).toEqual(1587894144030 + 3600000)

  expect(token.length).toBeGreaterThanOrEqual(20)
})
