const { graphqlHTTP } = require('express-graphql'),
  error = require('../utilities/error.gq'),
  { applyMiddleware } = require('graphql-middleware'),
  authenticator = require('../auth/index.gq');

const schemas = {
  v1: require('../v1/graphql/schemas')
}

const init = (app) => {
  // Create an express server and a GraphQL endpoint
  app.use('/v1/graphql', graphqlHTTP((req, res) => {
    const schemaWithMiddleware = applyMiddleware(
      schemas.v1,
      authenticator.AuthMiddleware()
    )
    return {
      schema: schemaWithMiddleware,
      pretty: true,
      graphiql: process.env.NODE_ENV !== 'production',
      customFormatErrorFn: error.customErrorFormatter,
      context: {
        req: req
      }
    }
  }));
}

module.exports = {
  init
}