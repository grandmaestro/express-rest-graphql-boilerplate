const {
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLBoolean,
} = require('graphql');

const workspaceSchema = require('../type/workspace');
const _commonSchema = require('../type/_common');
const resolver = require('../../resolvers/workspace');
const rootQueries =
{
  workspace: {
    type: workspaceSchema.WorkspaceType,
    args: { id: { type: new GraphQLNonNull(GraphQLInt) } },
    resolve: resolver.getWorkspaceByID
  },
  workspaces: {
    type: new GraphQLList(workspaceSchema.WorkspaceType),
    resolve: resolver.getWorkspaces
  }
}

const rootMutations = {
  addWorkspace: {
    type: workspaceSchema.WorkspaceType,
    args: {
      workspace: { type: workspaceSchema.InputWorkspaceType }
    },
    resolve: resolver.addWorkspace
  },
  updateWorkspace: {
    type: workspaceSchema.WorkspaceType,
    args: {
      workspace: { type: workspaceSchema.InputWorkspaceType }
    },
    resolve: resolver.updateWorkspace
  }
}

module.exports = {
  rootQueries,
  rootMutations
}
