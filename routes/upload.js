"use strict";

/** Routes for photos. */
const express = require('express');
const multer = require('multer');
const crypto = require('crypto');
const db = require("../db");

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
const { random } = require('colors');
const { DataBrew } = require('aws-sdk');

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

  const file = req.file
  // const stringFile = JSON.stringify(file)
  //{"fieldname":"image","originalname":"robert.jpg","encoding":"7bit","mimetype":"image/jpeg"
  const jsonFile = JSON.stringify({
    "fieldname": file.fieldname, 
    "originalname": file.originalname,
    "mimetype":file.mimetype })
    console.log('JSON FILE \n =>', jsonFile);
  // TODO: grab metadata from the image 


  const photoId = randomImageName();
  // Send data to S3
  const params = {
    Bucket: BUCKET_NAME,
    Key: photoId,
    Body: file.buffer,
    ContentType: file.mimetype,
  };
  const command = new PutObjectCommand(params);
  await s3.send(command);

  // do a insert into sql here 
  const result = await db.query(`
              INSERT INTO photos (photo_id
                                  image_info
                                  caption
                                  date_created)
              VALUES ($1, $2, $3)
              RETURNING 
                    photo_id AS photoId,
                    image_info AS imageInfo,
                    caption,
                    date_created AS dateCreated`, [
              photoId,
              jsonFile,
              req.body.caption,
            ]
  );

  const photo = result.rows[0];




  return res.status(201).json({ photo });
});



module.exports = router;