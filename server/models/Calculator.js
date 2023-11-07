import { ObjectId } from "bson";
import mongoose from "mongoose";

const { Schema } = mongoose;

const priceSchema = new Schema(
  {
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
  },
  { timestamps: true }
);
export const Price = mongoose.model("Price", priceSchema);

const optionSchema = new Schema({
  store: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  options: [
    {
      value: {
        type: String,
      },
      price: {
        type: Number
      }
    }
  ],
  rule: {
    type: Number,
    min: 0,
    max: 1,
    required: true
  }
})

export const Option = mongoose.model("Option", optionSchema);

const calculatorSchema = new Schema(
  {
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
    options: {
      type: String
    },
    minMaxWidth: {
      min: {
        type: Number,
        required: true,
        default: 0,
      },
      max: {
        type: Number,
        required: true,
        default: 0,
      },
    },
    minMaxHeight: {
      min: {
        type: Number,
        required: true,
        default: 0,
      },
      max: {
        type: Number,
        required: true,
        default: 0,
      },
    },
  },
  { timestamps: true }
);

export const Calculator = mongoose.model("Calculator", calculatorSchema);
