"use strict";

// random hex generator
const crypto = require('crypto');

// postgresql db
const db = require("./db");

// EXIF data extractor
const ExifImage = require('exif').ExifImage;

// Import S3 client to upload to bucket.
const { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

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
const { post } = require('./app');


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

const AWS_URL = `https://${BUCKET_NAME}.s3.${REGION}.amazonaws.com`;

class PhotoFile {

  /** Uploads a photo to database and s3 server */
  static async uploadPhoto(file) {
    console.log("file ===", file);

    const photoId = randomImageName();
    const buffer = file.buffer;

    const params = {
      Bucket: BUCKET_NAME,
      Key: photoId,
      Body: buffer,
      ContentType: file.mimetype,
    };
    const command = new PutObjectCommand(params);
    await s3.send(command);

    //TODO: EXIF data parser is not pulling any data
    const exif = new ExifImage({ buffer });
    const exifData = exif.exifData;

    /****************************************************************************
    * INSERT TO DB
    */
    const result = await db.query(`
              INSERT INTO photos (photo_id,
                                  metadata,
                                  date_created)
              VALUES ($1, $2, $3)
              RETURNING
                    photo_id AS photoId,
                    metadata,
                    date_created AS dateCreated`, [
      photoId,
      JSON.stringify(exifData),
      new Date()
    ]
    );

    const photoResponse = result.rows[0];

    return photoResponse;
  }

  /** Gets all photos from database and s3 server */
  static async getAllPhotos() {
    const result = await db.query(`
      SELECT photo_id, metadata, date_created
      FROM photos
      ORDER BY date_created DESC
    `);

    const photos = result.rows;
    const photoObjs = photos.map((photo) => ({
      photoId: photo.photo_id,
      metadata: photo.metadata,
      objectURL: `${AWS_URL}/${photo.photo_id}`
    }));

    return photoObjs;
  }

  /** Gets a photo from database and s3 server */
  static async getPhoto(id) {
    const result = await db.query(`
      SELECT photo_id, metadata, date_created
      FROM photos
      ORDER BY date_created DESC
    `);

    const photo = result.rows[0];
    const photoObj = {
      photoId: photo.photo_id,
      metadata: photo.metadata,
      objectURL: `${AWS_URL}/${photo.photo_id}`
    };

    return photoObj;
  }

  /** Deletes a photo from database and s3 server */
  static async deletePhoto(id) {
    const result = await db.query(`
      DELETE FROM photos
      WHERE photo_id = $1
    `, [id]);

    const params = {
      Bucket: BUCKET_NAME,
      Key: id
    };

    const command = new DeleteObjectCommand(params);
    await s3.send(command);

    return 'Successfully deleted';
  }
}

module.exports = PhotoFile;