"use strict";

// random hex generator
const crypto = require('crypto');
// postgresql db
const db = require("./db");

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
  BUCKET_NAME } = require('./config');


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


class PhotoFile {

  static async uploadPhoto(file, body) {
    /****************************************************************************
   * UPLOAD TO S3
   */

    console.log("file ===", file);
    console.log("body ===", body);

    const photoId = randomImageName();
    const caption = body.caption;;
    const buffer = file.buffer;

    const params = {
      Bucket: BUCKET_NAME,
      Key: photoId,
      Body: buffer,
      ContentType: file.mimetype,
    };
    const command = new PutObjectCommand(params);
    await s3.send(command);

    const exif = new ExifImage({ buffer });
    const exifData = exif.exifData;

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
      caption,
      new Date()
    ]
    );

    const photoResponse = result.rows[0];

    return photoResponse;
  }

  // static async getAllPhotos() {
  //   // make a request to S3/SDK
  //   // return array of object URLs
  // }

  // static async getPhoto() {
  //   // using the photo title or ID, get the photo from S3
  //   // return the object URL
  // }
}

module.exports = PhotoFile;