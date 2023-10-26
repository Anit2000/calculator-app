import { Router } from "express";
import clientProvider from "../../utils/clientProvider.js";
import { Calculator, Price } from "../models/Calculator.js";
import shopify from "../../utils/shopifyConfig.js";
import mongoose from "mongoose";

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
    res.json(request).status(200)
  } catch (err) {
    console.log(err.message);
    res.json({ message: err.message }).status(201)
  }
});

calculatorRoutes.post("/update-calculator", async (req, res) => {
  let { id, products, pricing } = req.body;
  let updates = {
    products: products,
    price: pricing
  };
  updates.price == null ? delete updates.price : "";
  try {
    let data = await Calculator.findByIdAndUpdate(id, updates, { new: true });
    if (pricing == null) {
      await Calculator.findByIdAndDelete(id);
      let newData = new Calculator({
        title: data.title,
        products: data.products,
        store: data.store
      });
      data = await newData.save();

    }
    res.json(data).status(200);
  } catch (err) {
    console.log(err.message);
    res.json({
      message: err.message
    }).status(201)
  }
})
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
    console.log(err);
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
    el.id = new mongoose.mongo.ObjectId();
    return { ...el };
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

calculatorRoutes.get("/pricing", async (req, res) => {
  const { shop } = await clientProvider.graphqlClient({
    req,
    res,
    isOnline: true,
  });
  try {
    let data = await Price.find({ store: shop });
    res.json(data).status(200);
  } catch (err) {
    res.json(err.message).status(201)
  }
})

calculatorRoutes.get("/price", async (req, res) => {
  let { id } = req.query;
  try {
    let data = await Price.findById(id);
    console.log(data);
    res.json(data).status(200);
  } catch (err) {
    console.log(err.message);
    res.json(err.message).status(201);
  }
})

calculatorRoutes.post("/update-price", async (req, res) => {
  let { id, pricing } = req.body;
  pricing = pricing.map((el) => {
    el.id = new mongoose.mongo.ObjectId();
    return { ...el };
  });
  try {
    let data = await Price.findByIdAndUpdate(id, { pricing: pricing }, { new: true });
    console.log(data)
    res.json(data).status(200)
  } catch (err) {
    console.log(err.message);
    res.json({ message: err.message }).status(201);
  }
})


export default calculatorRoutes;
