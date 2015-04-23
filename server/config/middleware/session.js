/**
 * Created by Alex on 22/04/2015.
 */
'use strict';

var session = require('express-session'),
	mongoStore = require('connect-mongo')({
		session: session
	}),
	passport = require('passport'),
	config = require('../config');

module.exports = function (app, db) {
	// Express MongoDB session storage
	app.use(session({
		saveUninitialized: true,
		resave: true,
		secret: config.sessionSecret,
		store: new mongoStore({
			mongooseConnection: db.connection,
			collection: config.sessionCollection
		}),
		cookie: config.sessionCookie,
		name: config.sessionName
	}));

	// use passport session
	app.use(passport.initialize());
	app.use(passport.session());

	console.log('Loaded middleware: session');
};
