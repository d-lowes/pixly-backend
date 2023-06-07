"use strict";

/** Routes for photos. */

// const jsonschema = require("jsonschema");

const express = require("express");
const router = new express.Router();

const PhotoFile = require("../photoFile");
const { DeleteObjectCommand } = require("@aws-sdk/client-s3");


/** Get all photos 
 * 
 * GET / => [{photo_url}, ... ]
 *
 * Returns an array of photo object URLs.
 *
*/
router.get("/", async function (req, res, next) {
  // call some class method that gets photos from amazon
  const photos = await PhotoFile.getAllPhotos();

  return res.json({ photos })
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
  const id = req.params.id
  const photo = await PhotoFile.getPhoto(id);

  return res.json({ photo })
});


/** Delete a  single photo
 * 
 * delete / => [{photo_url}]
 *
 * Returns 'Successfully deleted'
*/
router.delete("/:id", async function (req, res, next) {
  // call some class method that gets photos from amazon
  const id = req.params.id
  const message = await PhotoFile.deletePhoto(id);

  return res.json({ message })
});


module.exports = router;