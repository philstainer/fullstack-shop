import jwt from 'jsonwebtoken'

const generateUserCookie = (user, ctx) => {
  // Create token
  const token = jwt.sign({sub: user.id}, process.env.JWT_SECRET)

  // Set token for 365 days
  ctx.res.cookie('token', token, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 365,
  })
}

export default generateUserCookie
