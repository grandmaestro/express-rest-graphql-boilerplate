const graphql = require('graphql');
const wsRoot = require('./root/workspace');


const {
  GraphQLObjectType,
} = graphql;

/**
 * Create RootMutation out of all individual entities mutations
 */
const MutationType = new GraphQLObjectType({
  name: 'RootMutation',
  fields: {
    ...wsRoot.rootMutations
  }
});

module.exports = MutationType
