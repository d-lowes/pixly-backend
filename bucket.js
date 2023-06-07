"use strict";
const AWS = require('aws-sdk');
const { ACCESS_KEY,
  SECRET_ACCESS_KEY,
  REGION } = require('./config');

AWS.config.update({
  accessKeyId: ACCESS_KEY,
  secretAccessKey: SECRET_ACCESS_KEY,
  region: REGION
});

const s3 = new AWS.S3();


class Bucket {

  static async uploadPhoto(file) {
    /* accept a file object
        - define params using the file object and bucket name
        - call s3.upload
        - pull out the data.location (URL)
      return: object photo URL
      return resp.data.location;
     */
  }

  static async getAllPhotos() {
    // make a request to S3/SDK
    // return array of object URLs
  }

  static async getPhoto() {
    // using the photo title or ID, get the photo from S3
    // return the object URL
  }
}

// export default Bucket;