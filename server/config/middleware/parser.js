/**
 * Created by Alex on 22/04/2015.
 */
'use strict';

var bodyParser = require('body-parser'),
	methodOverride = require('method-override'),
	cookieParser = require('cookie-parser');

module.exports = function (app) {
	// Request body parsing middleware should be above methodOverride
	app.use(bodyParser.urlencoded({
		extended: true
	}));
	app.use(bodyParser.json());
	app.use(methodOverride());

	// CookieParser should be above session
	app.use(cookieParser());

	console.log('Loaded middleware: parser');
};
