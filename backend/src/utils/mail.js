import {createTransport} from 'nodemailer'

import accessEnv from '#root/utils/accessEnv'

export const transport = createTransport({
  host: accessEnv('MAIL_HOST'),
  port: accessEnv('MAIL_PORT'),
  auth: {
    user: accessEnv('MAIL_USER'),
    pass: accessEnv('MAIL_PASS'),
  },
})

export const basicTemplate = text => `
<div className="email" style="border: 1px solid black; padding: 20px; font-family: sans-serif; line-height: 2; font-size: 20px;">
  <h2>Hello There!</h2>
  <p>${text}</p>

  <p>😘, Fullstack Shop</p>
</div>
`
