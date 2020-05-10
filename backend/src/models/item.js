import {Schema, model, ObjectId} from 'mongoose'

const ItemSchema = new Schema(
  {
    title: {type: String, required: true, trim: true},
    description: {type: String, required: true, trim: true},
    imageUrl: {type: String, required: true, trim: true},
    price: {type: Number, required: true},
    createdBy: {type: ObjectId, ref: 'user'},
    updatedBy: {type: ObjectId, ref: 'user'},
  },
  {timestamps: true},
)

const ItemModel = model('item', ItemSchema)

export default ItemModel
