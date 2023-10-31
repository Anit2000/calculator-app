import { Router } from "express";
import clientProvider from "../../utils/clientProvider.js";
import { Calculator, Price } from "../models/Calculator.js";
import mongoose from "mongoose";
import csv from "csvtojson";

const calculatorRoutes = Router();

calculatorRoutes.post("/create-calculator", async (req, res) => {
  const { shop } = await clientProvider.graphqlClient({
    req,
    res,
    isOnline: true,
  });
  let data = req.body;
  console.log(data);
  data.store = shop;
  data.minMaxWidth = { min: data.minWidth, max: data.maxWidth };
  data.minMaxHeight = { min: data.minHeight, max: data.maxHeight };
  try {
    let calculatorData = new Calculator(data);
    let request = await calculatorData.save();
    res.json(request).status(200);
  } catch (err) {
    console.log(err.message);
    res.json({ message: err.message }).status(400);
  }
});

calculatorRoutes.post("/update-calculator", async (req, res) => {
  let { id, products, pricing, minMaxWidth, minMaxHeight } = req.body;
  let updates = {
    products: products,
    price: pricing,
    minMaxWidth: minMaxWidth,
    minMaxHeight: minMaxHeight,
  };
  updates.price == null ? delete updates.price : "";
  try {
    let data = await Calculator.findByIdAndUpdate(id, updates, { new: true });
    if (pricing == null) {
      await Calculator.findByIdAndDelete(id);
      let newData = new Calculator({
        title: data.title,
        products: data.products,
        store: data.store,
        minMaxWidth: data.minMaxWidth,
        minMaxHeight: data.minMaxHeight,
      });
      data = await newData.save();
    }
    res.json(data).status(200);
  } catch (err) {
    console.log(err.message);
    res
      .json({
        message: err.message,
      })
      .status(400);
  }
});
calculatorRoutes.get("/", async (req, res) => {
  const { shop } = await clientProvider.graphqlClient({
    req,
    res,
    isOnline: true,
  });
  try {
    let calculatorList = await Calculator.find({ store: shop }).populate(
      "price"
    );
    res.json(calculatorList ? calculatorList : []).status(200);
  } catch (err) {
    console.log(err);
    res
      .json({
        message: err.message,
      })
      .status(400);
  }
});

calculatorRoutes.get("/count", async (req, res) => {
  const { shop } = await clientProvider.graphqlClient({
    req,
    res,
    isOnline: true,
  });
  try {
    const count = await Calculator.find({ store: shop }).countDocuments();
    res.json(count).status(200);
  } catch (error) {
    console.log(err);
    res.json({ message: err }).status(400);
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
      .status(400);
  }
});

calculatorRoutes.delete("/delete", async (req, res) => {
  try {
    const { ids } = req.body;

    const result = await Calculator.deleteMany({ _id: { $in: ids } });

    if (result.deletedCount === 0) {
      res.status(404).json({
        message: "No calculators found for deletion.",
      });
    } else {
      res.status(200).json({
        message: "Calculators deleted successfully",
        deletedCount: result.deletedCount,
      });
    }
  } catch (error) {
    console.error("Error deleting calculators:", error);
    res.status(500).json({
      message: "Error deleting calculators",
      error: error.message,
    });
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
      .status(400);
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

calculatorRoutes.delete("/delete-price", async (req, res) => {
  try {
    const { ids } = req.body;

    const calculatorsToUpdate = await Calculator.find({ price: { $in: ids } });

    for (const calculator of calculatorsToUpdate) {
      calculator.price = null;
      await calculator.save();
    }

    const result = await Price.deleteMany({ _id: { $in: ids } });

    if (result.deletedCount === 0) {
      res.status(404).json({
        message: "No Price Group found for deletion.",
      });
    } else {
      res.status(200).json({
        message: "Price Group deleted successfully",
        deletedCount: result.deletedCount,
      });
    }
  } catch (error) {
    console.error("Error deleting price group:", error);
    res.status(500).json({
      message: "Error deleting price group",
      error: error.message,
    });
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
    res.json(err.message).status(400);
  }
});

calculatorRoutes.get("/pricingcount", async (req, res) => {
  const { shop } = await clientProvider.graphqlClient({
    req,
    res,
    isOnline: true,
  });
  try {
    let data = await Price.find({ store: shop }).countDocuments();
    res.json(data).status(200);
  } catch (err) {
    res.json(err.message).status(400);
  }
});

calculatorRoutes.get("/price", async (req, res) => {
  let { id } = req.query;
  try {
    let data = await Price.findById(id);
    res.json(data).status(200);
  } catch (err) {
    console.log(err.message);
    res.json(err.message).status(400);
  }
});

calculatorRoutes.post("/update-price", async (req, res) => {
  let { id, pricing } = req.body;
  pricing = pricing.map((el) => {
    el.id = new mongoose.mongo.ObjectId();
    return { ...el };
  });
  try {
    let data = await Price.findByIdAndUpdate(
      id,
      { pricing: pricing },
      { new: true }
    );
    res.json(data).status(200);
  } catch (err) {
    console.log(err.message);
    res.json({ message: err.message }).status(400);
  }
});

calculatorRoutes.post("/parse-csv", (req, res) => {
  let data = [];
  csv({ trim: true })
    .fromString(req.files.file.data.toString())
    .subscribe(
      (json) => data.push(json),
      (err) => {
        res.json(err).status(400);
      },
      () => {
        data = data.map((el) => ({ id: new mongoose.Types.ObjectId(), ...el }));
        res.json(data).status(200);
      }
    );
});
calculatorRoutes.post("/storefront/create-variant", async (req, res) => {
  let data = req.body;
  console.log(data);
});

export default calculatorRoutes;
