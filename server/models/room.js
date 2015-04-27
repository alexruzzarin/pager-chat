/**
 * Created by Alex on 27/04/2015.
 */
'use strict';

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var RoomSchema = new Schema({
	name: {
		type: String,
		trim: true,
		match: [/^[a-zA-Z0-9_-]*$/, 'Please fill a valid room name'],
		required: 'Please fill a valid room name'
	},
	private: {
		type: Boolean,
		default: false
	},
	owner: {
		type: String,
		trim: true,
		required: 'Please fill a owner'
	},
	users: {
		type: [String]
	},
	invitedUsers: {
		type: [String]
	}
});

mongoose.model('Room', RoomSchema);
