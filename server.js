import dotenv from "dotenv";
dotenv.config();
import express from "express";
import morgan from "morgan";
import log from "loglevel";

// Redis stuff
import redisClient from "./Redis/Redisconnection.js";
import limiter from "./Redis/limiter.js";
import Cache from "./Redis/cache.js";

// mongoose connection
connectDb(process.env.MONGO_URI);
// check if a redis connection exists
redisClient.on("connect", () => {
  log.info("Redis instance running");
});

import Product from "./productModel.js";
import connectDb from "./connectDb.js";
const app = express();

log.setLevel(log.levels.ERROR);
log.setLevel(log.levels.INFO);

// midleware
app.use(morgan("dev"));
app.use(express.json());
// setup rate limiting
app.use(limiter);

const createProduct = async (req, res) => {
  const data = req.body;

  const { product_name, product_price, product_description } = data;

  const newProduct = { product_name, product_price, product_description };

  //   create product

  const doc = await Product.create(newProduct);

  res.status(201).json(doc);
};

const getProduct = async (req, res) => {
  const { id } = req.params;
  // check if products exists in cache
  const cached = await Cache.getFromCache(id);

  if (cached) {
    return res.status(200).json(cached);
  } else {
    // set the cache
    const data = await Product.findById(id);
    Cache.setCache(data.id, data).then(() => {
      log.info("Data added to cache");
    });

    log.info(data);
  }

  const product = await Product.findById(id);

  return res.status(200).json(product);
};

const getAllProducts = async (req, res) => {
  const products = await Product.find();

  return res.status(200).json(products);
};

const updateProduct = async (req, res) => {
  const { id } = req.params;

  const product = await Product.findByIdAndUpdate(
    id,
    { $set: req.body },
    { new: true }
  );

  return res.status(200).json(product);
};

const deleteProduct = async (req, res) => {
  const { id } = req.params;

  const product = await Product.findByIdAndRemove(id);

  return res.status(200).json(product);
};

app.get("/product/all", getAllProducts);

app.post("/product", createProduct);

app.get("/product/:id", getProduct);

app.put("/product/:id", updateProduct);

app.delete("/product/:id", deleteProduct);

app.listen(9000, () => {
  return log.info("server started");
});
