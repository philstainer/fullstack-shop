import generateToken from '#root/utils/generateToken'

test('returns a randomly generated token', async () => {
  const token = await generateToken()

  expect(token.length).toEqual(120)
})

test('returns a randomly generated token with specified length', async () => {
  const token = await generateToken(20)

  expect(token.length).toEqual(40)
})
