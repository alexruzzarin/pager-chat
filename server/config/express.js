/**
 * Created by alex on 19/04/15.
 */

'use strict';

var express = require('express'),
	config = require('./config'),
	path = require('path');

module.exports = function (db) {
	// Initialize express app
	var app = express();

	db.initModels();

	require('./middleware/locals')(app);

	require('./middleware/compression')(app);

	// Showing stack errors
	app.set('showStackError', true);

	require('./middleware/view-engine')(app);
	require('./middleware/logger')(app);
	require('./middleware/parser')(app);
	require('./middleware/security')(app);


	// Setting the app router and static folder
	app.use(express.static(path.resolve('./public')));

	require('./middleware/session')(app, db);

	// connect flash for flash messages
	//app.use(flash());

	// Globbing routing files
	config.getGlobbedFiles('./server/routes/**/*.js').forEach(function (routePath) {
		require(path.resolve(routePath))(app);
	});

	require('./middleware/error')(app);

	// Return Express server instance
	return app;
};
