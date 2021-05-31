import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useFormState from '../utils/useFormState';
import { useLazyQuery } from '@apollo/client';
import { LOGIN } from '../graphql/queries';
import { Form, Button, Col } from 'react-bootstrap';

export default function Login(props) {
	const [formData, onChange] = useFormState({
		email: '',
		password: '',
	});

	const [errors, setErrors] = useState({});

	const [loginUser, { loading }] = useLazyQuery(LOGIN, {
		onError(err) {
			console.log(err.graphQLErrors[0]?.extensions?.errors);
			setErrors(err.graphQLErrors[0]?.extensions?.errors);
		},
		onCompleted(data) {
			localStorage.setItem('token', data.login.token);
			props.history.push('/home');
		},
	});

	const handleFormSubmit = (e) => {
		e.preventDefault();
		loginUser({ variables: formData });
	};

	return (
		<Col className='w-100 justify-content-center align-items-center h-100 d-flex'>
			<div className='form-card'>
				<Form onSubmit={handleFormSubmit}>
					<Form.Group className='mb-3'>
						<Form.Label>Email address</Form.Label>
						<Form.Control
							name='email'
							type='email'
							placeholder='Enter email'
							onChange={onChange}
							required
						/>
					</Form.Group>

					<Form.Group className='mb-3'>
						<Form.Label>Password</Form.Label>
						<Form.Control
							name='password'
							type='password'
							placeholder='Password'
							onChange={onChange}
							required
						/>
					</Form.Group>

					{errors.general && (
						<Form.Group className='mb-3'>
							<Form.Text className='text-muted'>
								<span className='text-danger'>{errors.general}</span>
							</Form.Text>
						</Form.Group>
					)}

					<Form.Group className='mb-3'>
						<Form.Text className='text-muted'>
							Don't have an account? <Link to='/register'>Register</Link>
						</Form.Text>
					</Form.Group>

					<Button variant='primary' type='submit' disabled={loading}>
						{loading ? 'Loading...' : 'Login'}
					</Button>
				</Form>
			</div>
		</Col>
	);
}
