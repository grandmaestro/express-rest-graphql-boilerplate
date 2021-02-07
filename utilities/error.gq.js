const logger = require('../logs/winston');
/**
 * Method to format the graphql errors and handle them with custom format
 * @param {*} err 
 */
const customErrorFormatter = (err) => {
  const originalError = err.originalError; // original error
  // err.message.code & err.message.exception are raised from resolving methods
  let message = {
    status: err.message.status || 500,
    exception: err.message.exception || err.message
  }
  let errObj = {
    message: message,
    path: err.path,
    locations: err.locations,
    stack: err.stack
  };
  logger.error(JSON.stringify(errObj));
  // DO NOT DELETE: removed stack from output but kept in logs
  delete errObj.stack;
  return errObj;
}

module.exports = {
  customErrorFormatter
}