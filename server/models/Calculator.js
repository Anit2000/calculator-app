import { ObjectId } from "bson";
import mongoose from "mongoose";

const { Schema } = mongoose;

const priceSchema = new Schema({
  store: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  pricing: {
    type: [
      {
        _id: {
          type: ObjectId, 
        },
        width: {
          type: String,
          required: true,
        },
        height: {
          type: String,
          required: true,
        },
        price: {
          type: String,
          required: true,
        },
      },
    ],
  },
});
export const Price = mongoose.model("Price", priceSchema);

const calculatorSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  store: {
    type: String,
    required: true,
  },
  price: {
    type: Schema.Types.ObjectId,
    ref: "Price",
  },
  products: {
    type: [String],
  },
});

export const Calculator = mongoose.model("Calculator", calculatorSchema);
