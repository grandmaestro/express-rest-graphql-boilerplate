const { validationResult } = require('express-validator'),
  logger = require('../logs/winston');

/**
 * Method to evaluate if the express-validator threw any validation errors
 * @param {*} req 
 * @param {*} res 
 */
const validate = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.error(JSON.stringify(errors));
    res.status(422).json(errors.array());
  } else {
    return true;
  }
}

module.exports = {
  validate,
}