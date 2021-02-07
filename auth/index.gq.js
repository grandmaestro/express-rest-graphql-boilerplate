const config = require('../config'),
  axios = require('axios'),
  cache = require('../utilities/memcache.util'),
  { GraphQLError } = require('graphql');


const auth = async (resolve, parent, args, context, info) => {
  // You can use middlewares to override arguments
  const authorization = context.req.headers.authorization;
  const token = authorization ? authorization.split(" ")[1] : null;

  const ERRORS = {
    UNAUTHORIZED: new GraphQLError({ message: 'Unauthorized user', status: 401 }),
    UNAVAILABLE: new GraphQLError({ message: 'User is not available for the operation. Contact administrator or Try Signing in again', status: 403 }),
    INTERNAL: new GraphQLError({ message: 'Something went wrong. User could not be verified. Contact administrator or Try Signing in again', status: 500 })
  }
  // Staging is zapr-dev but cookie gets set on zapr.in
  if (config.isDev) {
    // Just for bypassing auth in dev
    context.user = {
      "status": "active",
      "name": "User",
      "tokenStatus": "VALID",
      "email": "user@domain.in"
    }
  } else {
    if (!token) {
      throw ERRORS.UNAUTHORIZED;
    }
    let user = null;
    try {
      user = await cache.read(`GQ.AUTH`, token);
    } catch (e) {
    }
    if (!user) {
      try {
        user = await axios.post(config.sso.userTokenDetail, { token, service: config.sso.serviceId });
        user = user.data;
      } catch (error) {
        throw ERRORS.INTERNAL;
      }
    }
    if (user && user.email && user.userStatus === 'active' && user.tokenStatus === 'VALID') {
      context.user = user;
      await cache.insert(`GQ.AUTH`, token, user);
    } else {
      throw ERRORS.UNAVAILABLE;
    }
  }

  const result = await resolve(parent, args, context, info)
  // Or change the returned values of resolvers
  return result;
}

const AuthMiddleware = () => {
  return {
    RootQuery: auth,
    RootMutation: auth,
  }
}


module.exports = {
  AuthMiddleware
}