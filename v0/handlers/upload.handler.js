const uploadUtil = require('../../utilities/upload.util');


const uploadFile = (req) => {
  return new Promise(async (resolve, reject) => {
    try {
      const file = req.file;
      const type = req.body.type;
      const location = `${type}`;
      const data = await uploadUtil.uploadFileToS3(file, location);
      resolve(data);
    } catch (err) {
      reject(err);
    }
  });
}


module.exports = {
  uploadFile
}