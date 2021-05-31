import React from 'react';
import {
	BrowserRouter as Router,
	Route,
	Switch,
	Redirect,
} from 'react-router-dom';
import Login from './login';
import Register from './register';
import Home from './Home/home';
import { getUser } from '../utils/auth';

export default function AppRouter() {
	return (
		<>
			<Router>
				<Switch>
					<DynamicRoute path='/home' component={Home} authenticatedPath />
					<DynamicRoute path='/register' component={Register} />
					<DynamicRoute path='/login' component={Login} />
					<DynamicRoute path='/' component={Login} />
				</Switch>
			</Router>
		</>
	);
}

const DynamicRoute = (props) => {
	let user = getUser();

	if (!user && props.authenticatedPath) return <Redirect to='/login' />;

	if (user && !props.authenticatedPath) return <Redirect to='/home' />;

	return <Route component={props.component} {...props} />;
};
