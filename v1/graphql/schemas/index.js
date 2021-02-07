const { GraphQLSchema } = require('graphql'),
  RootQueryType = require('./query'),
  RootMutation = require('./mutation');

// Export GraphQL Schema with RootQueries & RootMutation
module.exports = new GraphQLSchema({
  query: RootQueryType,
  mutation: RootMutation
});