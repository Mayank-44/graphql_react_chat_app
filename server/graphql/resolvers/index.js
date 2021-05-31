const userResolvers = require('./users');
const groupResolvers = require('./groups');
const messageResolvers = require('./messages');

module.exports = {
	Group: {
		createdAt: (parent) => parent.createdAt.toISOString(),
	},
	Message: {
		createdAt: (parent) => parent.createdAt.toISOString(),
	},
	User: {
		createdAt: (parent) => parent.createdAt.toISOString(),
	},
	Query: {
		...userResolvers.Query,
		...messageResolvers.Query,
		...groupResolvers.Query,
	},
	Mutation: {
		...userResolvers.Mutation,
		...messageResolvers.Mutation,
	},
	Subscription: {
		...messageResolvers.Subscription,
	},
};
