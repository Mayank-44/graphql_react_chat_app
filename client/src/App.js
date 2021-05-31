import React from 'react';
import Routes from './components/route.js';

import { Container } from 'react-bootstrap';

function App() {
	return (
		<Container className='h-100 app-container rounded'>
			<Routes />
		</Container>
	);
}

export default App;

// const { loading, error, data } = useQuery(LOGIN, {
// 	variables: { email: 'mayank@abc.com', password: '123456' },
// });

// const { loading, error, data } = useQuery(FETCH_GROUPS);
// // if (data) localStorage.setItem('token', data.login.token);

// if (loading) return <div>Loading ...</div>;
// if (error) return `Error! ${error}`;
// console.log(data);
