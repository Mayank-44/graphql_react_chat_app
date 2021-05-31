import { useState } from 'react';

export default function FormState(initialState) {
	const [formState, setFormState] = useState(initialState);

	const onChange = (e) => {
		e.preventDefault();
		setFormState({ ...formState, [e.target.name]: e.target.value });
	};
	return [formState, onChange];
}
