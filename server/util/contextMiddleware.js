const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../config');
const { PubSub } = require('apollo-server');

const pubsub = new PubSub();

module.exports = (context) => {
	let token;

	// extracting authorization header either from request headers or connection header (websocker request)
	let authHeader = context.req?.headers?.authorization ?? context.connection?.context?.Authorization;
	if (authHeader) {
		token = authHeader.split('Bearer ')[1];
	}

	if (token) {
		jwt.verify(token, SECRET_KEY, (err, decodedToken) => {
			context.user = decodedToken;
		});
	}
	context.pubsub = pubsub;

	return context;
};
