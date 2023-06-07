"use strict";

/** Routes for photos. */

// const jsonschema = require("jsonschema");

const express = require("express");
const router = express.Router();

/** Get all photos 
 * 
 * GET / => [{photo_url}, ... ]
 *
 * Returns an array of photo object URLs.
 *
*/
router.get("/", async function (req, res, next) {
  // call some class method that gets photos from amazon
  const photos = await Bucket.getAllPhotos();

  return res.json({photos})
});


/** Get single photo
 * 
 * GET / => [{photo_url}]
 *
 * Returns a single object photo URL.
 *
*/
router.get("/:id", async function (req, res, next) {
  // call some class method that gets photos from amazon
  const photo = await Bucket.getPhoto();

  return res.json({photo})
});


module.exports = router;