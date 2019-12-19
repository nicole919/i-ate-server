require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const { NODE_ENV } = require("./config");
const mealsRouter = require("./meals/meals-router");

const app = express();

const morganSetting = process.env.NODE_ENV === "production" ? "tiny" : "common";
app.use(morgan(morganSetting));
app.use(cors());
app.use(helmet());

app.use("/api/meals", mealsRouter);
app.get("/", (req, res, next) => {
  res.send("Hello, world!");
  next();
});

app.use(function errorHandler(error, req, res, next) {
  let response;
  if (NODE_ENV === "production") {
    response = { error: "server error" };
  } else {
    console.error(error);
    response = { error: error.message, details: error };
  }
  res.status(500).json(response);
});

module.exports = app;
