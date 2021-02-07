const env = require('./env'),
    express = require('express'),
    rest = require('./middlewares/rest'),
    graphql = require('./middlewares/graphql'),
    middleware = require('./middlewares/middleware'),
    errors = require('./utilities/error.util'),
    app = express();

// Attach middlewares
middleware.use(app);

rest.init(app);

graphql.init(app);

// Error sanitizer handler
errors.sanitizeError(app);

module.exports = app;