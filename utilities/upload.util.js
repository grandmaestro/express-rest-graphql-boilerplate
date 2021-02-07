const config = require('../config'),
  fs = require('fs-extra'),
  logger = require('./../logs/winston'),
  mime = require('mime-types'),
  AWS = require("aws-sdk");

const s3Config = {
  region: config.aws.s3.region
}
if (config.aws.s3.accessId) {
  s3Config.accessKeyId = config.aws.s3.accessId;
  s3Config.secretAccessKey = config.aws.s3.secret;
}

const s3bucket = new AWS.S3(s3Config);

const uploadFileFromLocalToS3 = async (name, localPath, targetS3Path) => {
  try {
    const originalname = name || getFileName(localPath);
    const buffer = await fs.readFileSync(localPath);
    const mimeType = mime.lookup(localPath);
    const uploadData = await uploadFileToS3({
      originalname: originalname,
      buffer: buffer,
      mimetype: mimeType
    }, targetS3Path);
    return uploadData;
  } catch (error) {
    logger.error(`Error uploadFileFromLocalToS3: ${error.message}`);
    throw new Error(error.message);
  }
}

const getFileName = (name) => {
  name = name || '';
  name = name.split('/');
  const originalname = name[name.length - 1];
  return originalname;
}

/**
 * Method to upload a file to s3
 * @param {*} file 
 * @param {*} folder 
 */
const uploadFileToS3 = (file, folder) => {
  return new Promise(async (resolve, reject) => {
    //s3 location
    var params = {
      Bucket: `${config.aws.s3.bucket}/${config.aws.s3.baseDir}/${folder}`,
      Key: file.originalname,
      Body: file.buffer,
      ContentType: file.mimetype
    };

    s3bucket.upload(params, function (err, data) {
      if (err) {
        reject(err);
      } else {
        resolve({
          url: data.Location
        });
      }
    });
  })
}

/**
 * Method to get signed url out of an s3 object url
 * @param {*} url 
 */
const getSignedUrl = (url = '') => {
  url = decodeURIComponent(url || '');
  const folderPath = url.split('.amazonaws.com/')[1];
  if (!folderPath) {
    return null;
  }
  return new Promise((resolve, reject) => {
    s3bucket.getSignedUrl('getObject', {
      Bucket: config.aws.s3.bucket,
      Key: folderPath, //filename
      Expires: 60 * 60 * 24 //time to expire in seconds
    }, (error, presignedUrl) => {
      if (error) {
        resolve(null);
      } else {
        resolve(presignedUrl);
      }
    });
  });
}
/**
 * Method to get original object url from presigned url
 * @param {*} url 
 */
const getUnsignedUrl = (url = '') => {
  url = decodeURIComponent(url || '');
  const objectUrl = url.split(`?`)[0];
  if (objectUrl) {
    return objectUrl;
  } else {
    return null;
  }
}

module.exports = {
  uploadFileToS3,
  getSignedUrl,
  uploadFileFromLocalToS3,
  getUnsignedUrl,
  getFileName
}