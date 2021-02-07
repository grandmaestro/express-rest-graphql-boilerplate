const qs = require('query-string'),
  string = require('./string.util');

const generateQueryString = (queryObject) => {
  let queryStr = [];
  for (const key in queryObject) {
    queryStr.push(`${key}=${queryObject[key]}`);
  }
  queryStr = queryStr.join('&');
  return queryStr;
}

const cleanUrl = (url = '', options = {}) => {
  let str = url.trim();
  if (options.decode) {
    str = decodeURIComponent(str);
  }
  let query = qs.parseUrl(str);
  str = query.url;
  if (str.endsWith('/')) {
    str = str.substring(0, str.length - 1);
  }
  const clean = {
    url: str.trim(),
    query: query.query
  }

  return clean;

}

module.exports = {
  generateQueryString,
  cleanUrl
}