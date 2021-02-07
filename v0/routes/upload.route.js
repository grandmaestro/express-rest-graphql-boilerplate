const express = require('express'),
  uploadHandler = require('../handlers/upload.handler'),
  multer = require("multer");


const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = express.Router({
  mergeParams: true
});

router.post("/", upload.single("file"), 
  (req, res) => {
    return uploadHandler.uploadFile(req)
      .then((response) => {
          res.status(200).json(response);
      })
      .catch(err => {
          next(err);
      }); 
});


module.exports = router;