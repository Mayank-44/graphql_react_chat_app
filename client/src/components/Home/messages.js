import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useSubscription } from '@apollo/client';
import {
	FETCH_MESSAGES,
	SEND_MESSAGE,
	NEW_MESSAGE,
} from '../../graphql/queries';
import { getUser } from '../../utils/auth';
import { Form } from 'react-bootstrap';

export default function Messages(props) {
	const [user, setUser] = useState(null);
	const [content, setContent] = useState('');
	const [messages, setMessages] = useState([]);

	const { error, data } = useQuery(FETCH_MESSAGES, {
		variables: { from: props.selectedGroup.id },
		fetchPolicy: 'cache-and-network',
	});

	useEffect(() => {
		let user = getUser();
		if (user) setUser(user);
	}, []);

	useEffect(() => {
		setMessages(data);
	}, [data]);

	// const { data: newMessage, error: wsError } = useSubscription(NEW_MESSAGE);

	useEffect(() => {
		if (
			props.newMessage &&
			props.newMessage.newMessage?.group?.name === props.selectedGroup?.name
		) {
			let msgArray = [...messages.fetchMessages] ?? [];
			msgArray.unshift(props.newMessage.newMessage);
			setMessages({ fetchMessages: msgArray });
		}
	}, [props.newMessage]);

	const [sendMessage] = useMutation(SEND_MESSAGE, {
		variables: { to: props.selectedGroup.id, content: content },
		update() {
			setContent('');
		},
		onError(err) {
			console.log(err?.graphQLErrors[0]?.extensions?.errors);
		},
	});

	if (error) return <div>error :(</div>;

	const getMessage = (msg) => {
		const sent = msg.author.username === user.username;
		return (
			<div
				key={msg.id}
				className={`d-flex ${sent ? 'sent-div' : 'recieved-div'}`}
			>
				<div
					className={`msg-div py-2 px-3 ${sent ? 'msg-sent' : 'msg-recieved'}`}
				>
					{!sent && <div>{msg.author.username}</div>}
					<span className={'text-white'} key={msg.id}>
						{msg.content}
					</span>
					<div
						className={'text-white time-badge'}
						style={{ fontSize: '0.8rem' }}
					>
						{new Date(msg.createdAt).toLocaleString()}
					</div>
				</div>
			</div>
		);
	};

	const getMessages = (data) => {
		return data?.fetchMessages?.map((msg) => getMessage(msg));
	};

	const handleFormSubmit = (e) => {
		e.preventDefault();
		sendMessage();
	};

	return (
		<>
			<div
				className='d-flex flex-column h-100 pb-0'
				style={{ padding: '1.5rem' }}
			>
				<div className='d-flex flex-column-reverse h-100 overflow-auto'>
					{getMessages(messages)}
				</div>

				<div>
					<div className='py-2'>
						<Form onSubmit={handleFormSubmit}>
							<Form.Group className='d-flex align-items-center m-0'>
								<Form.Control
									type='text'
									className='message-input rounded-pill p-2 border-0'
									placeholder='Type a message..'
									onChange={(e) => setContent(e.target.value)}
									value={content}
									required
								/>
								<i
									className='fas fa-paper-plane fa-2x text-primary send-button'
									role='button'
									onClick={() => handleFormSubmit()}
								></i>
							</Form.Group>
						</Form>
					</div>
				</div>
			</div>
		</>
	);
}
