
const listPartials = require('express-list-endpoints');

const init = (app) => {
  // Define the versions
  var VERSIONS = {
    'common': '/v0',
    'version_1': '/v1'
  };

  // Route to display versions
  app.get('/versions', function (req, res) {
    res.json(VERSIONS);
  })

  // versioned routes go in the routes/ directory
  // import the routes
  for (var k in VERSIONS) {
    app.use(VERSIONS[k], require('../versions' + VERSIONS[k]));
  }

  app.get('/endpoints', function (req, res) {
    res.json(listPartials(app));
  })
}

module.exports = {
  init
}