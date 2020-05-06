import {Schema, model, Decimal128} from 'mongoose'

const OrderItemSchema = new Schema(
  {
    title: {type: String, required: true, trim: true},
    description: {type: String, required: true, trim: true},
    image: {type: String, trim: true},
    largeImage: {type: String, trim: true},
    price: {type: Decimal128, required: true},
    quantity: {type: Number, required: true, default: 1},
    order: {type: Schema.Types.ObjectId, ref: 'order', required: true},
  },
  {timestamps: true},
)

const OrderItemModel = model('orderItem', OrderItemSchema)

export default OrderItemModel
