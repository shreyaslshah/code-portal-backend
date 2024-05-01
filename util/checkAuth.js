const jwt = require('jsonwebtoken');
const { AuthenticationError } = require('apollo-server');
require('dotenv').config();

module.exports = (context) => {
  const key = process.env.JWT_KEY;
  const authHeader = context.req.headers.authorization;
  if (authHeader) {
    const token = authHeader;
    if (token) {
      try {
        const user = jwt.verify(token, key);
        return user;
      }
      catch (error) {
        throw new AuthenticationError('invalid/expired token');
      }
    }
    throw new AuthenticationError('authentication token not provided');
  }
  throw new AuthenticationError('authorization header not provided');
}