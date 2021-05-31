const { AuthenticationError } = require('apollo-server');
const Group = require('../../models/Group');

module.exports = {
	Query: {
		async fetchGroups(_, __, { user }) {
			try {
				if (!user) throw new AuthenticationError('Unauthenticated');
				let groups = await Group.find().populate('members');
				return groups;
			} catch (err) {
				throw new Error(err);
			}
		},
	},
};
