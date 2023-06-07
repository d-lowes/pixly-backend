"use strict";

/** Routes for photos. */

const express = require('express');
// photo uploader
const multer = require('multer');
// router
const router = new express.Router();
// Class with static methods
const PhotoFile = require("../photoFile");


/****************************************************************************
 * Upload photo to multer
 *
 * */
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


/*
  * POST ROUTE
  * Upload a photo to S3 bucket and save data to the DB
  * Return JSON
* */
router.post("/", upload.single('image'), async function (req, res, next) {
  const photo = await PhotoFile.uploadPhoto(req.file, req.body);

  console.log("photo ==== ", photo);

  return res.status(201).json({ photo });
});



module.exports = router;