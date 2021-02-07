const express = require('express'),
  router = express.Router(),
  healthCheck = require('../v0/routes/health.route'),
  upload = require('../v0/routes/upload.route');


router.use('/health', healthCheck);
router.use('/upload', upload);

module.exports = router;