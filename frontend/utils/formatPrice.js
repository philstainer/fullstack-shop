const formatPrice = price => {
  const options = {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 2,
  }

  if (price % 100 === 0) options.minimumFractionDigits = 0

  const formatter = new Intl.NumberFormat('en-UK', options)

  return formatter.format(price / 100)
}

export default formatPrice
