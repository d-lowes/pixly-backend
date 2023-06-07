"use strict";

/** Express app for jobly. */

const express = require("express");

const photosRoutes = require("./routes/photos");
const uploadRoutes = require("./routes/upload");

const app = express();

app.use(express.json());

app.use("/photos", photosRoutes);
app.use("/upload", uploadRoutes);

module.exports = app;