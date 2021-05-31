const { model, Schema } = require('mongoose');

const groupSchema = new Schema({
	name: { type: String, required: 'Group should have a name' },
	members: [{ type: Schema.Types.ObjectId, ref: 'user' }],
	createdAt: { type: Date, default: Date.now },
	imgURL: String,
});

module.exports = model('group', groupSchema, 'group');
