import mongoose from "mongoose";

const { Schema } = mongoose;



const priceSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    pricing: {
        type: [
            {
                width: {
                    type: String,
                    required: true,
                }
            },
            {
                height: {
                    type: String,
                    required: true
                }
            },
            {
                price: {
                    type: String,
                    required: true,
                }
            }
        ]
    }
})


const calcualtorSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    store: {
        type: String,
        required: true
    },
    price: {
        type: priceSchema
    },
    products: {
        type: [String]
    }
})

const Calculator = mongoose.model('Calculator', calcualtorSchema);

export default Calculator;