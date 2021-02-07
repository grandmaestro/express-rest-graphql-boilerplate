const {
  createLogger,
  format,
  transports
} = require('winston');
require('winston-daily-rotate-file');

const logLevel = process.env.LOG_LEVEL;

// Instantiate a new Winston Logger with the settings defined above

const customFormat = format.printf(info => {
  return `${info.timestamp} ${info.level}:: ${info.message}`
})


const logger = createLogger({
  level: logLevel,
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    customFormat
  ),
  transports: [
    new transports.Console({
      stderrLevels: ['error'],
      handleExceptions: true
    }),
    new transports.DailyRotateFile({
      name: 'api',
      filename: 'api-logs/api-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '10m', // 10MB
      maxFiles: 10, // 10 files
      json: false,
      colorize: true,
      level: logLevel,
      format: format.combine(
        format.timestamp(),
        customFormat
      )
    })
  ],
  exitOnError: false
});

// create a stream object with a 'write' function that will be used by `morgan`
logger.stream = {
  write: function (message, encoding) {
    // use the 'info' log level so the output will be picked up by both transports (file and console)
    logger.info(message);
  },
};

module.exports = logger;