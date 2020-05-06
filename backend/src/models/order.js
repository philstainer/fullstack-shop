import {Schema, model, Decimal128} from 'mongoose'

const OrderSchema = new Schema(
  {
    total: {type: Decimal128, required: true},
    charge: {type: String, required: true},
    user: {type: Schema.Types.ObjectId, ref: 'user', required: true},
  },
  {timestamps: true},
)

const OrderModel = model('order', OrderSchema)

export default OrderModel
