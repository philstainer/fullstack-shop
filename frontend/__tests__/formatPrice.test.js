import formatPrice from '#root/utils/formatPrice'

test('formats pence into pounds and removes .00', () => {
  expect(formatPrice(2900)).toEqual('£29')
})

test('formats pence into pounds within 2 decimal places', () => {
  expect(formatPrice(2999)).toEqual('£29.99')
})
