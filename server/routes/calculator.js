import { Router } from "express";
import clientProvider from "../../utils/clientProvider.js";
import Calculator from "../models/Calculator.js";
import shopify from "../../utils/shopifyConfig.js";
import clientProvider from "../../utils/clientProvider.js";

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
  //   try {
  //     let client = await clientProvider.restClient()
  //     let request = client.shop.
  //   } catch (err) {
  //     console.log(err);
  //   }
});
export default calculatorRoutes;
