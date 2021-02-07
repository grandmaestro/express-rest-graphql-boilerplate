const moment = require('moment');

/**
 * Helper method to get durations in minutes
 * @param {*} durationStr
 * @param {*} type 
 */
const getAsMinutes = (durationStr, type) => {
  let duration = null;
  switch (type) {
    default:
      duration = moment.duration(durationStr, "seconds").asMinutes();
      break;
  }
  if (!!duration) {
    duration = parseInt(duration, 10);
  }
  return duration;
}

const formatDateStr = (string, format = 'YYYY-MM-DD') => {
  return moment(string).format(format);
}

module.exports = {
  getAsMinutes,
  formatDateStr
}