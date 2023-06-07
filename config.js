"use strict";

/** Shared config for application; can be required many places. */

require("dotenv").config();
require("colors");

const SECRET_KEY = process.env.SECRET_KEY || "secret-dev";
const ACCESS_KEY = process.env.ACCESS_KEY;
const SECRET_ACCESS_KEY = process.env.SECRET_ACCESS_KEY;
const REGION = process.env.REGION;
const BUCKET_NAME = process.env.BUCKET_NAME;


const PORT = +process.env.PORT || 3001;

// Use dev database, testing database, or via env var, production database
function getDatabaseUri() {
  return (process.env.NODE_ENV === "test")
      ? process.env.DATABASE_URL_TEST
      : process.env.DATABASE_URL || "pixly";
}

module.exports = {
  SECRET_KEY,
  PORT,
  ACCESS_KEY,
  SECRET_ACCESS_KEY,
  REGION,
  BUCKET_NAME,
  getDatabaseUri,
};