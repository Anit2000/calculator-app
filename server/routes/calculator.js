import { Router } from "express";
import clientProvider from "../../utils/clientProvider.js";
import { Calculator, Price } from "../models/Calculator.js";
import shopify from "../../utils/shopifyConfig.js";

const calculatorRoutes = Router();

calculatorRoutes.post("/create-calculator", async (req, res) => {
  const { shop } = await clientProvider.graphqlClient({
    req,
    res,
    isOnline: true,
  });
  let data = req.body;
  data.store = shop;
  try {
    let calculatorData = new Calculator(data);
    let request = await calculatorData.save();
    console.log(request);
  } catch (err) {
    console.log(err.message);
  }
});

calculatorRoutes.get("/", async (req, res) => {
  const { shop } = await clientProvider.graphqlClient({
    req,
    res,
    isOnline: true,
  });
  try {
    let calculatorList = await Calculator.find({ store: shop });
    res.json(calculatorList ? calculatorList : []).status(200);
  } catch (err) {
    res
      .json({
        message: err.message,
      })
      .status(201);
  }
});

calculatorRoutes.get("/calculator", async (req, res) => {
  const { shop } = await clientProvider.graphqlClient({
    req,
    res,
    isOnline: true,
  });
  let query = req.query;
  let id = query.id.split("calc-")[1];
  console.log("hetre", id);
  try {
    let calculatorData = await Calculator.findOne({ store: shop, _id: id });
    res.json(calculatorData).status(200);
  } catch (err) {
    res
      .json({
        message: err.message,
      })
      .status(201);
  }
});

calculatorRoutes.get("/products", async (req, res) => {
  let { ids } = req.query;
  try {
    let { client } = await clientProvider.restClient({
      req,
      res,
      isOnline: true,
    });
    let data = await client.get({
      path: `/products`,
      query: {
        ids: ids,
      },
    });
    res
      .json({
        products: data.body.products,
      })
      .status(200);
  } catch (err) {
    res
      .json({
        ok: false,
      })
      .status(201);
  }
});

calculatorRoutes.post("/create-price", async (req, res) => {
  const { shop } = await clientProvider.graphqlClient({
    req,
    res,
    isOnline: true,
  });
  let pricingData = req.body;
  pricingData.store = shop;
  let pricing = pricingData.pricing.map((el) => {
    delete el.id;
    return el;
  });
  pricingData.pricing = pricing;
  try {
    let priceData = new Price(pricingData);
    let data = await priceData.save();
    res.json(data).status(200);
  } catch (err) {
    res
      .json({
        ok: false,
        message: err.message,
      })
      .status(301);
  }
});
export default calculatorRoutes;
