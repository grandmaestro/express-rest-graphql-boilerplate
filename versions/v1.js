const express = require('express'),
  router = express.Router(),
  exportRouter = require('../v1/rest/routes/export.route');

router.use('/export', exportRouter);

module.exports = router;