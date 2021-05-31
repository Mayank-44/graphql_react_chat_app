const { model, Schema } = require('mongoose');

const userSchema = new Schema({
	username: {
		type: String,
		trim: true,
		lowercase: true,
		required: 'username is required',
	},
	email: {
		type: String,
		trim: true,
		lowercase: true,
		unique: true,
		required: 'Email address is required',
		match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
	},
	password: String,
	createdAt: { type: Date, default: Date.now },
});

module.exports = model('user', userSchema, 'user');
