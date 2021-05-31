import { gql } from '@apollo/client';

export const LOGIN = gql`
	query login($email: String!, $password: String!) {
		login(email: $email, password: $password) {
			username
			email
			createdAt
			token
		}
	}
`;

export const FETCH_GROUPS = gql`
	query fetchGroups {
		fetchGroups {
			id
			name
			members {
				username
			}
			createdAt
			imgURL
		}
	}
`;

export const FETCH_MESSAGES = gql`
	query fetchMessages($from: String!) {
		fetchMessages(from: $from) {
			author {
				username
			}
			content
			createdAt
		}
	}
`;

export const REGISTER = gql`
	mutation AddTodo(
		$email: String!
		$username: String!
		$password: String!
		$confirmPassword: String!
	) {
		register(
			email: $email
			username: $username
			password: $password
			confirmPassword: $confirmPassword
		) {
			username
		}
	}
`;

export const SEND_MESSAGE = gql`
	mutation sendMessage($to: String!, $content: String!) {
		sendMessage(to: $to, content: $content) {
			group {
				name
			}
			author {
				username
			}
			content
			createdAt
		}
	}
`;

export const NEW_MESSAGE = gql`
	subscription newMessage {
		newMessage {
			id
			group {
				name
			}
			author {
				username
			}
			content
			createdAt
		}
	}
`;
