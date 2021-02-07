const graphql = require('graphql'),
  {
    GraphQLObjectType,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull,
    GraphQLInputObjectType
  } = graphql;

const GraphQLLong = require('graphql-type-long');
const _commonSchema = require('./_common');
const { GraphQLJSONObject } = require('graphql-type-json');

/**
 * GET: Workspace Schema
 */
const WorkspaceType = new GraphQLObjectType({
  name: 'Workspace',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLInt) },
    name: { type: _commonSchema.NonEmptyString },
    createdBy: { type: _commonSchema.NonEmptyString },
    createdOn: { type: GraphQLLong },
    isActive: {
      type: _commonSchema.ActiveEnumType,
      defaultValue: _commonSchema.ActiveEnumType.getValue('ACTIVE').value
    }
  })
});

/**
 * POST/PUT: Input Workspace Schema
 */
const InputWorkspaceType = new GraphQLInputObjectType({
  name: 'InputWorkspace',
  fields: () => ({
    id: { type: GraphQLInt },
    name: { type: _commonSchema.NonEmptyString },
    isActive: {
      type: _commonSchema.ActiveEnumType,
      defaultValue: _commonSchema.ActiveEnumType.getValue('ACTIVE').value
    },
  })
});


module.exports = {
  WorkspaceType,
  InputWorkspaceType
}