/**
 * Created by alex on 19/04/15.
 */
'use strict';
var consolidate = require('consolidate');

module.exports = function (app) {
	app.engine('hbs', consolidate.handlebars);

	// Set views path and view engine
	app.set('view engine', 'hbs');
	app.set('views', './server/views');


	// Environment dependent middleware
	if (process.env.NODE_ENV === 'development') {
		// Disable views cache
		app.set('view cache', false);
	} else if (process.env.NODE_ENV === 'production') {
		app.locals.cache = 'memory';
	}

	console.log('Loaded middleware: view-engine');
};
