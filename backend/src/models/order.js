import {Schema, model, ObjectId} from 'mongoose'

const OrderSchema = new Schema(
  {
    total: {type: Number, required: true},
    charge: {type: String, required: true},
    user: {type: ObjectId, ref: 'user', required: true},
  },
  {timestamps: true},
)

const OrderModel = model('order', OrderSchema)

export default OrderModel
