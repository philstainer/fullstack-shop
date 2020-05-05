import jwt from 'jsonwebtoken'

const generateUserCookie = (user, ctx) => {
  // Create token
  const token = jwt.sign({sub: user._id}, process.env.JWT_SECRET)

  // Set token for 365 days
  ctx.res.cookie('token', token, {
    httpOnly: true,
    maxAge: 365 * 24 * 60 * 60 * 1000,
  })
}

export default generateUserCookie
