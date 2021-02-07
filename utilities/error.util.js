const messages = require('../com/constants/messages/index'),
  logger = require('../logs/winston'),
  status = require('../com/constants/status'),
  metrics = require('../utilities/metrics.util');

/**
 * Method to generate a error response based on exceptions and custom messages
 * @param {*} error 
 * @param {*} override 
 */
const evalError = (error = {}, override) => {

  const fnGetMessage = (msg, custMessage) => {
    const message = [];
    (!!msg) ? message.push(msg) : null;
    (!!custMessage) ? message.push(custMessage) : null;
    let exception = message.join(' or ');
    if (!exception) {
      exception = messages.api.com.error;
    }
    return exception;
  };
  let reject = null;
  reject = {
    status: error.status || 400,
    exception: fnGetMessage(error.exception || error.message, override)
  }
  return reject;
}

/**
 * Method to attach custom error sanitizer to the app module
 * @param {*} app 
 */
const sanitizeError = (app) => {
  app.use((err, req, res, next) => {
    if (!!err) {
      let exception = null;
      if (err instanceof Error) {
        logger.error(err.message);
        exception = err.message;
      } else {
        logger.error(JSON.stringify(err));
        exception = err.exception || err.message;
      }
      if (!err.status) {
        err = {
          status: 500,
          exception: exception || status.code[500]
        };
      }
      metrics.invoke('increment', `${messages.statsd.exception.status}.${err.status}`);
      return res.status(err.status).json(err);
    }

  });
}

module.exports = {
  evalError,
  sanitizeError
}