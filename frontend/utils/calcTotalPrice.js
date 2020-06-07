const calcTotalPrice = cart =>
  cart.reduce(
    (total, cartItem) =>
      cartItem.item ? total + cartItem.quantity * cartItem.item.price : total,
    0,
  )

export default calcTotalPrice
