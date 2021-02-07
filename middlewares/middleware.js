const express = require('express'),
  morgan = require('morgan'),
  winston = require('../logs/winston'),
  compression = require('compression'),
  cors = require('cors'),
  helmet = require('helmet');

/**
 * Method to attach all the middlewares to the app module
 * @param {*} app 
 */
const use = (app) => {
  // use helmet to set secure headers
  app.use(helmet())

  // parse requests as json
  app.use(express.json());

  // define req-body token for custom logging format
  morgan.token('req-body', function (req, res) {
    return req.body ? JSON.stringify(req.body) : undefined;
  });

  morgan.format('custom', ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version"  :status :res[content-length] ":referrer" ":user-agent"')
  // request-body :req-body

  // attach morgan request logs in winston logs
  app.use(morgan('custom', {
    stream: winston.stream
  }));

  // set response header to deny any keep-alive requests
  app.use((req, res, next) => {
    res.setHeader('Connection', 'close');
    next();
  });

  // set compression to maximum
  app.use(compression({ level: 9 }));

  if (process.env.NODE_ENV !== "production") {
    //enables cors only on dev
    app.use(cors({
      'origin': '*'
    }));
  }
}


module.exports = {
  use
}