import { Price, Calculator } from "../models/Calculator.js";
import clientProvider from "../../utils/clientProvider.js";
import mongoose from "mongoose";

const createVariant = async (req, res) => {
    let { productId, height, width } = req.body;
    console.log(productId, "here")
    let requestedArea = Number(height) * Number(width);
    let store = req.headers["x-shop-domain"];
    try {
        // getting list of all calculators related to store
        let calculators = await Calculator.find({ store: store });
        // filtering out claculator that contains logic for product
        let productCalculator = calculators.find(calculator => calculator.products.join(",").includes(productId));
        // getting pricings as per calculator
        let { pricing } = await Price.findById(productCalculator.price).exec();
        // sorting pricing
        pricing = pricing.map(price => ({ area: Number(price.height) * Number(price.width), ...price })).sort((a, b) => a.area - b.area);
        // filtering price to calcualte 
        let filteredPrice = pricing.find(price => requestedArea <= price.area);
        let pricePerUnit = filteredPrice.area / Number(filteredPrice._doc.price);
        let calculatedPrice = requestedArea * pricePerUnit;

        // making res request for variant
        const { client } = await clientProvider.offline.restClient({
            shop: store,
        });
        let variantTitle = `calcualtor-${new mongoose.Types.ObjectId().toString()}`;
        let data = await client.post({
            path: `/products/${productId}/variants`,
            data: {
                id: 8289044136210,
                variant: {
                    price: calculatedPrice,
                    option1: variantTitle,
                }
            }
        })
        res.json(data.body.variant).status(200)
    } catch (err) {
        res.json(err.message).status(201);
    }
}
export default createVariant;