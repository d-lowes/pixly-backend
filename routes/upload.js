"use strict";

/** Routes for photos. */

const express = require('express');
// photo uploader
const multer = require('multer');
// random hex generator
const crypto = require('crypto');
// postgresql db
const db = require("../db");
// router
const router = express.Router();

// EXIF data extractor
const ExifImage = require('exif').ExifImage;

// Import S3 client to upload to bucket.
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");


/****************************************************************************
 *  Generate a random hex code for an image name
 * */
function randomImageName(bytes = 32) {
  return crypto.randomBytes(bytes).toString('hex');
}

/**************************************************************************
 * declare secret bucket keys
*/
const { ACCESS_KEY,
  SECRET_ACCESS_KEY,
  REGION,
  BUCKET_NAME } = require('../config');


/**************************************************************************
 * create new S3 client using bucket access data
*/
const s3 = new S3Client({
  credentials: {
    accessKeyId: ACCESS_KEY,
    secretAccessKey: SECRET_ACCESS_KEY
  },
  region: REGION
});

/****************************************************************************
 * Upload photo to multer
 *
 * */
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


/* whatever you specify in the .single parameter, has to be the name attribute
the frontend form */
/****************************************************************************
  * POST ROUTE
  * Upload a photo to S3 bucket and save data to the DB
* */

router.post("/", upload.single('image'), async function (req, res, next) {
  // console.log("req.body ===", req.body);
  // console.log('req.file ===', req.file);
  const file = req.file;
  const buffer = file.buffer;

  const exif = new ExifImage({ buffer });
  const exifData = exif.exifData;
  console.log("exifData.data ==== ", exifData);

  /****************************************************************************
   * UPLOAD TO S3
   */

  const photoId = randomImageName();

  const params = {
    Bucket: BUCKET_NAME,
    Key: photoId,
    Body: file.buffer,
    ContentType: file.mimetype,
  };
  // const command = new PutObjectCommand(params);
  // await s3.send(command);

  /****************************************************************************
  * INSERT TO DB
  */
  const result = await db.query(`
              INSERT INTO photos (photo_id,
                                  metadata,
                                  caption,
                                  date_created)
              VALUES ($1, $2, $3, $4)
              RETURNING
                    photo_id AS photoId,
                    metadata,
                    caption,
                    date_created AS dateCreated`, [
    photoId,
    JSON.stringify(exifData),
    req.body.caption,
    new Date()
  ]
  );

  const photo = result.rows[0];
  console.log("photo ==== ", photo);
  return res.status(201).json({ photo });
});



module.exports = router;