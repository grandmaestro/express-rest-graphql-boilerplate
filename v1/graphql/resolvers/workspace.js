const mysql = require('../../../db/mysql'),
  { WS } = require('../queries'),
  { GraphQLError } = require('graphql'),
  string = require('../../../utilities/string.util'),
  axios = require('axios'),
  logger = require('../../../logs/winston');
const uploadUtil = require('../../../utilities/upload.util');
const { zip } = require('zip-a-folder');
const fs = require('fs-extra');
const config = require('../../../config');

/**
 * Method to get all workspaces
 * @param {*} parent 
 * @param {*} args 
 */
const getWorkspaces = async (parent, args, context) => {
  try {
    let ws = await mysql.queryReplica(WS.ALL_WORKSPACES);
    ws = await getPublishDetail(ws);
    return ws;
  } catch (e) {
    throw new GraphQLError({ exception: 'Failed to fetch workspaces' });
  }
}

/**
 * Method to get workspace detail by workspace_id
 * @param {*} parent 
 * @param {*} args 
 */
const getWorkspaceByID = async (parent, args, context) => {
  try {
    let ws = await mysql.queryReplica(WS.WORKSPACE_BY_ID, [args.id]);
    ws = await getPublishDetail(ws);
    return ws[0];
  } catch (e) {
    throw new GraphQLError({ exception: `Failed to fetch workspace by ID: ${args.id}` });
  }
}

/**
 * Mutate add workspace and return workspace by id
 * @param {*} parent 
 * @param {*} args 
 */
const addWorkspace = async (parent, args, context) => {
  const workspace = args.workspace;
  const params = [
    string.clean(workspace.name),
    (workspace.globalContext) ? JSON.stringify(workspace.globalContext) : null,
    context.user.email
  ];
  try {

    const insert = await mysql.queryMaster(WS.ADD_WORKSPACE, params);

    const ws = await getWorkspaceByID(null, { id: insert.insertId }, context);
    return ws;
  } catch (error) {
    logger.error(`Error: addWorkspace: ${error.message}`);
    throw new GraphQLError({ exception: `Failed to add workspace for name: ${workspace.name}` });
  }
}

/**
 * Mutate update workspace and return workspace by id
 * @param {*} parent 
 * @param {*} args 
 */
const updateWorkspace = async (parent, args, context) => {
  const workspace = args.workspace;
  if (workspace.id < 1) {
    throw new GraphQLError({ exception: `Unknown workspace` });
  }
  const params = [
    string.clean(workspace.name),
    workspace.isActive,
    workspace.id
  ];
  try {
    await mysql.queryMaster(WS.UPDATE_WORKSPACE, params);
    const ws = await getWorkspaceByID(null, { id: workspace.id }, context);
    return ws;
  } catch (error) {
    logger.error(`Error: updateWorkspace: ${error.message}`);
    throw new GraphQLError({ exception: `Failed to update workspace for name: ${args.name}` });
  }
}


module.exports = {
  getWorkspaces,
  getWorkspaceByID,
  addWorkspace,
  updateWorkspace
}