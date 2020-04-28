import {randomBytes} from 'crypto'
import {promisify} from 'util'

const generateToken = async (length = 60) => {
  const bytes = await promisify(randomBytes)(length)

  return bytes.toString('hex')
}

export default generateToken
