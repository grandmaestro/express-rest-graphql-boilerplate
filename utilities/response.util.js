const status = require('../com/status');

/**
 * Method to check if list is empty, if then return 204 response
 * @param {*} response 
 */
const empty = (response) => {
  let isEmpty = false;

  isEmpty = ((Array.isArray(response) && !response.length)
    || (typeof response === 'object' && !Object.keys(response).length)
    || response === null || response === undefined);

  if (isEmpty) {
    return {
      status: 204,
      exception: status.code[204]
    }
  } else {
    return null;
  }
}

const notFound = () => {
  return {
    status: 404,
    exception: status.code[404]
  }
}

const badRequest = () => {
  return {
    status: 400,
    exception: status.code[400]
  }
}

module.exports = {
  empty,
  notFound,
  badRequest
}