import jwt_decode from 'jwt-decode';

export const getUser = () => {
	let user = null;
	const token = localStorage.getItem('token');
	if (token) {
		const decodedToken = jwt_decode(token);
		const tokenExpirationTime = decodedToken.exp * 1000;

		if (tokenExpirationTime < Date.now()) {
			localStorage.removeItem('token');
			window.location.href = '/login';
		} else return decodedToken;
	}

	return user;
};
