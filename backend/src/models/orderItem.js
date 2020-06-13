import {Schema, model, ObjectId} from 'mongoose'

const OrderItemSchema = new Schema(
  {
    title: {type: String, required: true, trim: true},
    description: {type: String, required: true, trim: true},
    imageUrl: {type: String, required: true, trim: true},
    price: {type: Number, required: true},
    quantity: {type: Number, required: true, default: 1},
    order: {type: ObjectId, ref: 'order', required: true},
  },
  {timestamps: true},
)

const OrderItemModel = model('orderItem', OrderItemSchema)

export default OrderItemModel
