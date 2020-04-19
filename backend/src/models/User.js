'use strict'

import {Schema, model} from 'mongoose'

const UserSchema = new Schema(
  {
    name: {type: String, required: true, trim: true},
    email: {
      type: String,
      required: [true, 'Please provide your email.'],
      trim: true,
      lowercase: true,
      unique: true,
    },
    passwordHash: {
      type: String,
      required: [true, 'Please provide a password'],
    },
    resetToken: String,
    resetTokenExpiry: Number,
    permissions: {
      type: [String],
      enum: [
        'ADMIN',
        'USER',
        'ITEMCREATE',
        'ITEMUPDATE',
        'ITEMDELETE',
        'PERMISSIONUPDATE',
      ],
    },
  },
  {timestamps: true},
)

const UserModel = model('user', UserSchema)

export default UserModel
