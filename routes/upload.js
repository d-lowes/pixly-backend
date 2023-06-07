"use strict";

/** Routes for photos. */

// const jsonschema = require("jsonschema");

const express = require("express");
const multer = require('multer');
const AWS = require('aws-sdk');

const { ACCESS_KEY,
  SECRET_ACCESS_KEY,
  REGION } = require('./config');

const router = express.Router();
const upload = multer({ dest: 'uploads/' })

AWS.config.update({
  accessKeyId: ACCESS_KEY,
  secretAccessKey: SECRET_ACCESS_KEY,
  region: REGION
});

const s3 = new AWS.S3();

router.post("/upload", upload.single('image'), async function (req, res, next) {
  // call some class method that gets photos from amazon
  // Multer here, gets metadata and 
  console.log('File metadata:', req.file);
  console.log('File source:', req.file.path);

  // upload to computer (multer pulls photo and puts it into sdk)
    // just send img to 
      // let photoData = await S3Class.uploadImage(image); goes to S3 returns object_url
      // PhotoClass.uploadImage({photoData}); goes to database DONT WANT IMAGE THOUGH


  // upload to S3 server (the photo that was plucked from multer)

  const photo = await Bucket.uploadPhoto();

  return res.json({ photo })
});

module.exports = router;