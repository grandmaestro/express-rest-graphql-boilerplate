const graphql = require('graphql'),
  {
    GraphQLEnumType,
    GraphQLScalarType,
    GraphQLObjectType,
    GraphQLError,
    Kind
  } = graphql;

/**
 * Method to parse non-empty, non-null string for GraphQL scalar type
 * @param {*} v 
 */
const fnParseString = v => {
  if (v === undefined || v === null) return null
  const string = String(v).trim();
  if (string.length) {
    return string;
  } else {
    throw new GraphQLError({ exception: 'NonEmptyString can not be null/undefined/empty' });
  }
}
/**
 * GraphQL scalar type for non-empty, non-null string
 */
const NonEmptyString = new GraphQLScalarType({
  name: 'NonEmptyString',
  description: "Parse string for non-null/non-empty values",
  serialize: fnParseString,
  parseValue: fnParseString,
  parseLiteral(ast) {
    return ast.kind === Kind.STRING ? fnParseString(ast.value) : null;
  }
});

/**
 * Common GraphQL Enum for ACTIVE/INACTIVE properties
 */
const ActiveEnumType = new GraphQLEnumType({
  name: 'ActiveEnum',
  values: {
    ACTIVE: {
      value: 1,
    },
    INACTIVE: {
      value: 0,
    }
  },
});

/**
 * Common GraphQL Enum for returning url string
 */
const URLType = new GraphQLObjectType({
  name: 'Url',
  fields: () => ({
    url: { type: NonEmptyString }
  })
});


module.exports = {
  ActiveEnumType,
  NonEmptyString,
  URLType
}