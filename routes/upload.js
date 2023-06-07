"use strict";

/** Routes for photos. */
const express = require('express');
const multer = require('multer');
const crypto = require('crypto');

const router = express.Router();

// Import S3 client to upload to bucket.
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

/** Generate a random hex code for an image name */
function randomImageName(bytes = 32) {
  return crypto.randomBytes(bytes).toString('hex');
}

// Pull bucket authentication data
const { ACCESS_KEY,
  SECRET_ACCESS_KEY,
  REGION,
  BUCKET_NAME } = require('../config');

// Pass auth data into S3 clientß
const s3 = new S3Client({
  credentials: {
    accessKeyId: ACCESS_KEY,
    secretAccessKey: SECRET_ACCESS_KEY
  },
  region: REGION
});

// Setup multer buffer storageß
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

/* whatever you specify in the .single parameter, has to be the name attribute
the frontend form */

/** Upload a photo to S3 bucket and save data to the DB */
router.post("/", upload.single('image'), async function (req, res, next) {
  console.log("req.body ===", req.body);
  console.log('req.file ===', req.file);


  // Send data to S3
  const params = {
    Bucket: BUCKET_NAME,
    Key: randomImageName(),
    Body: req.file.buffer,
    ContentType: req.file.mimetype,
  };
  const command = new PutObjectCommand(params);
  await s3.send(command);



  res.send({});
});



module.exports = router;