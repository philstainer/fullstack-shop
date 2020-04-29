'use strict'

import Joi from '@hapi/joi'

export const name = Joi.string().min(3).max(30).required()
export const email = Joi.string().email().required()
export const password = Joi.string()
  .pattern(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,30}$/,
  )
  .required()
  .messages({
    'string.pattern.base':
      '"password" does not meet complexity the requirements',
  })
export const confirmPassword = Joi.any()
  .valid(Joi.ref('password'))
  .messages({'any.only': '"password" and "confirm password" do not match'})

export const signUpSchema = Joi.object({name, email, password, confirmPassword})
export const requestReset = Joi.object({email})
