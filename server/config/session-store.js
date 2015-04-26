/**
 * Created by Alex on 25/04/2015.
 */
'use strict';

var session = require('express-session'),
	mongoStore = require('connect-mongo')({
		session: session
	}),
	config = require('./config');

module.exports = function (db) {
	var sessionStore = new mongoStore({
		mongooseConnection: db.connection,
		collection: config.sessionCollection
	});

	return sessionStore;
};
