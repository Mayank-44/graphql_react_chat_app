const {
	UserInputError,
	withFilter,
	AuthenticationError,
} = require('apollo-server');
const Message = require('../../models/Message');
const Group = require('../../models/Group');

module.exports = {
	Query: {
		async fetchMessages(_, { from }) {
			try {
				const messages = await Message.find({ group: from })
					.populate('author')
					.sort({ createdAt: -1 });
				return messages;
			} catch (err) {
				throw new Error(err);
			}
		},
	},
	Mutation: {
		async sendMessage(_, { to, content }, { user, pubsub }) {
			if (!user) throw new AuthenticationError('Unauthenticated');
			let errors = {};
			if (content.trim() === '') {
				throw new Error('Message body must not be empty');
			}

			const group = await Group.findOne({ _id: to });

			if (!group) {
				errors.general = 'Group not found';
				throw new UserInputError('Group not found', { errors });
			}

			const newMessage = new Message({
				content,
				group: to,
				author: user.id,
				createdAt: new Date().toISOString(),
			});

			let message = await newMessage.save();
			message = await message
				.populate('author')
				.populate('group')
				.execPopulate();
			pubsub.publish('NEW_MESSAGE', {
				newMessage: message,
			});

			return message;
		},
	},
	Subscription: {
		newMessage: {
			subscribe: withFilter(
				(_, __, { pubsub, user }) => {
					if (!user) throw new AuthenticationError('Unauthenticated');
					return pubsub.asyncIterator('NEW_MESSAGE');
				},
				({ newMessage }, _, { user }) => {
					// if (newMessage.group.members.includes(user.id)) return true;
					// return false;
					return true;
				}
			),
		},
	},
};
