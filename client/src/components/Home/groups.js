import React, { useState, useEffect } from 'react';
import { useQuery, useSubscription } from '@apollo/client';
import { Image, Tooltip, OverlayTrigger } from 'react-bootstrap';
import Messages from './messages';
import { getUser } from '../../utils/auth';
import { Row, Col } from 'react-bootstrap';
import logoutIcon from '../../assets/logout.svg';
import { FETCH_GROUPS, NEW_MESSAGE } from '../../graphql/queries';

export default function Groups(props) {
	const [user, setUser] = useState(null);
	const [selectedGroup, setSelectedGroup] = useState(null);
	const { loading, error, data } = useQuery(FETCH_GROUPS);
	useEffect(() => {
		let user = getUser();
		if (user) setUser(user);
	}, []);

	const { data: newMessage, error: wsError } = useSubscription(NEW_MESSAGE);
	if (loading) return null;
	if (error) {
		if (error?.graphQLErrors[0]?.message.includes('AuthenticationError')) {
			localStorage.removeItem('token');
			window.location.href = '/login';
		}

		return <div>Failed to fetch</div>;
	}

	const getGroups = (data) =>
		data.fetchGroups.map((group) => (
			<div
				key={group.id}
				role='button'
				className={`user-div d-flex justify-content-center justify-content-md-start p-3 ${
					selectedGroup && group.name === selectedGroup.name ? 'selected' : ''
				}`}
				key={group.username}
				onClick={() => setSelectedGroup(group)}
			>
				<Image
					src={
						group.imgURL ||
						'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'
					}
					className='user-image'
				/>
				<div
					className='d-none d-md-block'
					style={{ marginLeft: '10px', flexGrow: '1' }}
				>
					<p className='text-success mb-1'>{group.name}</p>
					<small className='text-muted' style={{ fontSize: '0.8rem' }}>
						{group.latestMessage
							? group.latestMessage?.content
							: `created on ${new Date(group.createdAt).toDateString()}`}
					</small>
				</div>
			</div>
		));

	const handleLogout = () => {
		localStorage.removeItem('token');
		window.location.href = '/login';
	};

	const renderTooltip = (props) => (
		<Tooltip id='button-tooltip' {...props}>
			Logout
		</Tooltip>
	);

	return (
		<Row className='h-100'>
			<Col xs={2} md={3} className='p-0 h-100 overflow-auto'>
				<div className='user-profile'>
					<span className='chip d-none d-md-flex'>{user?.username}</span>
					<OverlayTrigger
						placement='right'
						delay={{ show: 250, hide: 400 }}
						overlay={renderTooltip}
					>
						<img
							src={logoutIcon}
							alt='logout'
							role='button'
							width='20px'
							onClick={handleLogout}
						/>
					</OverlayTrigger>
				</div>

				{data.fetchGroups.length > 0 ? (
					getGroups(data)
				) : (
					<div className='d-flex justify-content-center w-100 mt-3'>
						<h5>NO GROUP FOUND</h5>
					</div>
				)}
			</Col>
			<Col xs={10} md={9} className='p-0 h-100 overflow-hidden'>
				{selectedGroup ? (
					<Messages selectedGroup={selectedGroup} newMessage={newMessage} />
				) : (
					''
				)}
			</Col>
		</Row>
	);
}
