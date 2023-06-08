"use strict";

/** Express app for jobly. */

const express = require("express");
const cors = require("cors");

const photosRoutes = require("./routes/photos");
const uploadRoutes = require("./routes/upload");

const app = express();

// TODO: When deployed switch the origin url 
app.use(cors({
    origin: 'http://localhost:3000'
  }));
app.use(express.json());

app.use("/photos", photosRoutes);
app.use("/upload", uploadRoutes);

module.exports = app;