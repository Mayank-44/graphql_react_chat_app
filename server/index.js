const { ApolloServer } = require('apollo-server');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const contextMiddleware = require('./util/contextMiddleware');
const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');
const { MONGODB } = require('./config.js');

dotenv.config();

const PORT = process.env.PORT;

const server = new ApolloServer({
	cors: {
		origin: '*', // <- allow request from all domains
		credentials: true,
	},
	typeDefs,
	resolvers,
	context: contextMiddleware,
});

mongoose
	.connect(MONGODB, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
	})
	.then(() => {
		console.log('MongoDB Connected');
		return server.listen({ port: PORT });
	})
	.then((res) => {
		console.log(`Server running at ${res.url}`);
	})
	.catch((err) => {
		console.error(err);
	});
