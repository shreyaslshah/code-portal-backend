const codeResolvers = require('./code');
const userResolvers = require('./users')

module.exports = {
  Query: {
    ...codeResolvers.Query,
    ...userResolvers.Query
  },
  Mutation: {
    ...codeResolvers.Mutation,
    ...userResolvers.Mutation
  }
};