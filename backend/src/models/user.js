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
    password: {
      type: String,
      required: [true, 'Please provide a password'],
    },
    confirmed: {
      type: Boolean,
      default: false,
    },
    confirmToken: String,
    confirmTokenExpiry: Date,
    resetToken: String,
    resetTokenExpiry: Date,
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
      default: 'USER',
    },
  },
  {timestamps: true},
)

const UserModel = model('user', UserSchema)

export default UserModel
