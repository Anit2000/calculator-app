import { Price, Calculator } from "../models/Calculator.js";
import clientProvider from "../../utils/clientProvider.js";
import mongoose from "mongoose";

export const createVariant = async (req, res) => {
  let { productId, height, width } = req.body;
  // console.log(productId, "here");
  let requestedArea = Number(height) * Number(width);
  const { client } = await clientProvider.offline.graphqlClient({
    shop: res.locals.user_shop,
  });
  let store = client.session.shop;
  console.log("shop name here", client.session.shop);
  try {
    // getting list of all calculators related to store
    let calculators = await Calculator.find({ store: store });
    // filtering out claculator that contains logic for product
    let productCalculator = calculators.find((calculator) =>
      calculator.products.join(",").includes(productId)
    );
    // getting pricings as per calculator
    let { pricing } = await Price.findById(productCalculator.price);
    // sorting pricing
    pricing = pricing
      .map((price) => ({
        area: Number(price.height) * Number(price.width),
        ...price,
      }))
      .sort((a, b) => a.area - b.area);
    // filtering price to calcualte
    let filteredPrice = pricing.find((price) => requestedArea <= price.area);
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
        },
      },
    });
    res.json(data.body.variant).status(201);
  } catch (err) {
    res.json(err.message).status(501);
  }
};

export const returnPrices = async (req, res) => {
  let { productId } = req.body;
  // console.log(productId, "here");
  const { client } = await clientProvider.offline.graphqlClient({
    shop: res.locals.user_shop,
  });
  let store = client.session.shop;
  console.log("shop name here", client.session.shop);
  try {
    // getting list of all calculators related to store
    let calculators = await Calculator.find({ store: store });
    console.log("calculator found", calculators);
    // filtering out claculator that contains logic for product
    let productCalculator = calculators.find((calculator) =>
      calculator.products.indexOf(productId) != -1
    );
    console.log("Product found", productCalculator);
    // getting pricings as per calculator
    let { pricing } = await Price.findById(productCalculator.price);
    console.log("Pricing found", pricing);
    // sorting pricing
    const priceData = pricing.map((price) => ({
      area: price.width * price.height,
      price: price.price,
    }));
    res.json(priceData).status(200);
  } catch (err) {
    res.json(err.message).status(501);
  }
};
