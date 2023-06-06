"use strict";

/** Express app for jobly. */

const express = require("express");

const photosRoutes = require("./photos");

const app = express();

app.use(express.json());

app.use("/photos", photosRoutes);

module.exports = app;