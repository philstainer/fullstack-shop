import calcTotalPrice from '#root/utils/calcTotalPrice'

import {fakeItem, fakeCartItem} from '#root/utils/testUtils'

test('calculate total price', () => {
  const cart = [
    fakeCartItem({item: fakeItem({price: 4})}),
    fakeCartItem({item: fakeItem({price: 1})}),
  ]

  const total = calcTotalPrice(cart)

  expect(total).toBe(5)
})

test('return total when item does not exist', () => {
  const cart = [
    fakeCartItem({item: fakeItem({price: 4})}),
    fakeCartItem({item: null}),
  ]

  const total = calcTotalPrice(cart)

  expect(total).toBe(4)
})
