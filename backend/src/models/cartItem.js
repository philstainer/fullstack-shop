import {Schema, model} from 'mongoose'

const CartItemSchema = new Schema(
  {
    quantity: {type: Number, required: true, default: 1},
    user: {type: Schema.Types.ObjectId, ref: 'user', required: true},
    item: {type: Schema.Types.ObjectId, ref: 'item'},
  },
  {timestamps: true},
)

const CartItemModel = model('cartItem', CartItemSchema)

export default CartItemModel
