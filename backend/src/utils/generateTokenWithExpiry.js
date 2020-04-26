import {randomBytes} from 'crypto'
import {promisify} from 'util'

const generateTokenWithExpiry = async (expiry = 3600000, length = 20) => {
  const randomBytesPromisified = await promisify(randomBytes)(length)

  const token = randomBytesPromisified.toString('hex')

  const tokenExpiry = Date.now() + expiry // 1 hour token

  return {token, tokenExpiry}
}

export default generateTokenWithExpiry
