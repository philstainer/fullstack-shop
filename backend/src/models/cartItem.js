import {Schema, model, ObjectId} from 'mongoose'

const CartItemSchema = new Schema(
  {
    quantity: {type: Number, required: true, default: 1},
    user: {type: ObjectId, ref: 'user', required: true},
    item: {type: ObjectId, ref: 'item', required: true},
  },
  {timestamps: true},
)

const CartItemModel = model('cartItem', CartItemSchema)

export default CartItemModel
