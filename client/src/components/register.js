import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { Link } from 'react-router-dom';
import { REGISTER } from '../graphql/queries';
import useFormState from '../utils/useFormState';
import { Form, Button, Col } from 'react-bootstrap';

export default function Register(props) {
	const [formData, onChange] = useFormState({
		email: '',
		username: '',
		password: '',
		confirmPassword: '',
	});

	const [errors, setErrors] = useState({});

	const [registerUser, { loading }] = useMutation(REGISTER, {
		variables: formData,
		update() {
			props.history.push('/login');
		},
		onError(err) {
			setErrors(err.graphQLErrors[0].extensions.errors);
		},
	});

	const handleFormSubmit = (e) => {
		e.preventDefault();
		registerUser();
	};
	return (
		<Col className='w-100 justify-content-center align-items-center h-100 d-flex'>
			<div className='form-card'>
				<Form onSubmit={handleFormSubmit}>
					<Form.Group className='mb-3'>
						<Form.Label className={errors.email && 'text-danger'}>
							{errors.email ?? 'Email address'}
						</Form.Label>
						<Form.Control
							className={errors.email && 'is-invalid'}
							name='email'
							type='email'
							placeholder='Enter email'
							onChange={onChange}
							required
						/>
					</Form.Group>

					<Form.Group className='mb-3'>
						<Form.Label className={errors.username && 'text-danger'}>
							{errors.username ?? 'Username'}
						</Form.Label>
						<Form.Control
							className={errors.username && 'is-invalid'}
							name='username'
							type='text'
							placeholder='Enter username'
							onChange={onChange}
							required
						/>
					</Form.Group>

					<Form.Group className='mb-3'>
						<Form.Label className={errors.password && 'text-danger'}>
							{errors.password ?? 'Password'}
						</Form.Label>
						<Form.Control
							className={errors.password && 'is-invalid'}
							name='password'
							type='password'
							placeholder='Password'
							onChange={onChange}
							required
						/>
					</Form.Group>

					<Form.Group className='mb-3'>
						<Form.Label className={errors.confirmPassword && 'text-danger'}>
							{errors.confirmPassword ?? 'Confirm password'}
						</Form.Label>
						<Form.Control
							className={errors.confirmPassword && 'is-invalid'}
							name='confirmPassword'
							type='password'
							placeholder='Confirm password'
							onChange={onChange}
							required
						/>
					</Form.Group>

					<Form.Group className='mb-3'>
						<Form.Text className='text-muted'>
							Already have an account? <Link to='/login'>Login</Link>
						</Form.Text>
					</Form.Group>

					<Button variant='primary' type='submit' disabled={loading}>
						{loading ? 'Loading...' : 'Register'}
					</Button>
				</Form>
			</div>
		</Col>
	);
}
