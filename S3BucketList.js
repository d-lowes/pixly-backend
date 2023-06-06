"use strict";

const AWS = require('aws-sdk');
const { ACCESS_KEY,
  SECRET_ACCESS_KEY,
  REGION } = require('./config');

// Configure AWS SDK with your credentials
AWS.config.update({
  accessKeyId: ACCESS_KEY,
  secretAccessKey: SECRET_ACCESS_KEY,
  region: REGION,
});

const s3 = new AWS.S3();

const getBucketList = async () => {
  try {
    const response = await s3.listBuckets().promise();
    const buckets = response.Buckets;

    return buckets;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

// Usage
getBucketList()
  .then((buckets) => {
    console.log(buckets);
  })
  .catch((err) => {
    console.error(err);
  });