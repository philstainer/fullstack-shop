import jwt from 'jsonwebtoken'
import accessEnv from '#root/utils/accessEnv'

const generateUserCookie = (user, ctx) => {
  // Create token
  const token = jwt.sign({sub: user._id}, accessEnv('JWT_SECRET'))

  // Set token for 365 days
  ctx.res.cookie('token', token, {
    httpOnly: true,
    maxAge: 365 * 24 * 60 * 60 * 1000,
  })
}

export default generateUserCookie
