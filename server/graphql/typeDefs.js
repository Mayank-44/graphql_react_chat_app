const { gql } = require('apollo-server');

module.exports = gql`
	type User {
		username: String!
		email: String!
		createdAt: String!
		token: String
	}
	type Group {
		id: ID!
		name: String!
		members: [User]!
		createdAt: String!
		imgURL: String
	}
	type Message {
		id: ID!
		group: Group!
		author: User!
		content: String!
		createdAt: String!
	}
	type Query {
		login(email: String!, password: String!): User!
		fetchGroups: [Group]!
		fetchMessages(from: String!): [Message]!
	}
	type Mutation {
		register(
			username: String!
			email: String!
			password: String!
			confirmPassword: String!
		): User!
		sendMessage(to: String!, content: String!): Message!
	}
	type Subscription {
		newMessage: Message!
	}
`;
