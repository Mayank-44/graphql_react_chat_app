const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UserInputError } = require('apollo-server');

const {
	validateRegisterInput,
	validateLoginInput,
} = require('../../util/validators');
const { SECRET_KEY } = require('../../config');
const User = require('../../models/User');
const Group = require('../../models/Group');

function generateToken(user) {
	return jwt.sign(
		{
			id: user.id,
			email: user.email,
			username: user.username,
		},
		SECRET_KEY,
		{ expiresIn: '1h' }
	);
}

module.exports = {
	Query: {
		async login(_, { email, password }) {
			const { errors, valid } = validateLoginInput(email, password);

			if (!valid) {
				throw new UserInputError('Errors', { errors });
			}

			const user = await User.findOne({ email });

			if (!user) {
				errors.general = 'User not found';
				throw new UserInputError('User not found', { errors });
			}

			const match = await bcrypt.compare(password, user.password);
			if (!match) {
				errors.general = 'Wrong crendetials';
				throw new UserInputError('Wrong crendetials', { errors });
			}

			const token = generateToken(user);

			return {
				...user._doc,
				id: user._id,
				token,
			};
		},
	},
	Mutation: {
		async register(_, { username, email, password, confirmPassword }) {
			// Validate user data
			const { valid, errors } = validateRegisterInput(
				username,
				email,
				password,
				confirmPassword
			);
			if (!valid) {
				throw new UserInputError('Errors', { errors });
			}
			// Make sure account with given email does not already exist
			const user = await User.findOne({ email });
			if (user) {
				throw new UserInputError(`Account already exist with email ${email}`, {
					errors: {
						email: `Account already exist with email ${email}`,
					},
				});
			}
			// hash password
			password = await bcrypt.hash(password, 12);

			const newUser = new User({
				email,
				username,
				password,
				createdAt: new Date().toISOString(),
			});

			try {
				const res = await newUser.save();
				// create an auth token
				const token = generateToken(res);
				return {
					...res._doc,
					id: res._id,
					token,
				};
			} catch (err) {
				throw new Error(err);
			}
		},
	},
};
