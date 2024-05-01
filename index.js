const { ApolloServer } = require('apollo-server');
const mongoose = require('mongoose');
const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers/index');
require('dotenv').config();


const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    return { req };
  }
});

const PORT = process.env.PORT || 4000;

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true })
  .then(() => {
    return server.listen({ port: PORT });
  }).then((res) => {
    console.log('db connected')
  }).catch((error)=>{
    console.log(error);
  });
