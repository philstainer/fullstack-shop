'use strict'

import {Schema, model, Decimal128} from 'mongoose'

const ItemSchema = new Schema(
  {
    title: {type: String, required: true, trim: true},
    description: {type: String, required: true, trim: true},
    image: {type: String, trim: true},
    largeImage: {type: String, trim: true},
    price: {type: Decimal128, required: true},
  },
  {timestamps: true},
)

const ItemModel = model('item', ItemSchema)

export default ItemModel
