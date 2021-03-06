import {
	ApolloClient,
	InMemoryCache,
	createHttpLink,
	split,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { getMainDefinition } from '@apollo/client/utilities';
import { WebSocketLink } from '@apollo/client/link/ws';

let httpLink = createHttpLink({
	uri: process.env.REACT_APP_SERVER_ENDPOINT,
});

const authLink = setContext((_, { headers }) => {
	// get the authentication token from local storage if it exists
	const token = localStorage.getItem('token');
	// return the headers to the context so httpLink can read them
	return {
		headers: {
			...headers,
			authorization: `Bearer ${token}`,
		},
	};
});

httpLink = authLink.concat(httpLink);

const wsLink = new WebSocketLink({
	uri: process.env.REACT_APP_WEBSOCKET_ENDPOINT, //'ws://localhost:4000/graphql',
	options: {
		reconnect: true,
		connectionParams: {
			Authorization: `Bearer ${localStorage.getItem('token')}`,
		},
	},
});

// The split function takes three parameters:
//
// * A function that's called for each operation to execute
// * The Link to use for an operation if the function returns a "truthy" value
// * The Link to use for an operation if the function returns a "falsy" value
const splitLink = split(
	({ query }) => {
		const definition = getMainDefinition(query);
		return (
			definition.kind === 'OperationDefinition' &&
			definition.operation === 'subscription'
		);
	},
	wsLink,
	httpLink
);

export default new ApolloClient({
	link: splitLink,
	cache: new InMemoryCache(),
	connectToDevTools: true,
	fetchOptions: {
		mode: 'no-cors',
	},
});
