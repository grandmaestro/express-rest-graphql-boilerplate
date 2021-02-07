const graphql = require('graphql');
const wsRoot = require('./root/workspace');


const {
  GraphQLObjectType,
} = graphql;
/**
 * Create RootQuery out of all individual entities queries
 */
const RootQueryType = new GraphQLObjectType({
  name: 'RootQuery',
  fields: {
    ...wsRoot.rootQueries
  }
});

module.exports = RootQueryType