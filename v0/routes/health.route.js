const express = require('express');
const router = express.Router({
  mergeParams: true
});
const handler = require('../handlers/health.handler');

/* GET health check of application */
router.get('/', function (req, res, next) {
  handler
    .checkProcess()
    .then((result) => {
      res.status(200).json(result)
    }).catch((err) => {
      next(err);
    });
});
module.exports = router;