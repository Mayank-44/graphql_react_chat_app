const { model, Schema } = require('mongoose');

const messageSchema = new Schema({
	group: {
		type: Schema.Types.ObjectId,
		ref: 'group',
	},
	author: {
		type: Schema.Types.ObjectId,
		ref: 'user',
	},
	createdAt: { type: Date, default: Date.now },
	content: String,
});

module.exports = model('message', messageSchema, 'message');
