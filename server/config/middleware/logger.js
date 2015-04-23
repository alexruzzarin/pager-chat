/**
 * Created by Alex on 22/04/2015.
 */
'use strict';

var morgan = require('morgan'),
	logger = require('../logger');

module.exports = function (app) {
	// Enable logger (morgan)
	app.use(morgan(logger.getLogFormat(), logger.getLogOptions()));

	console.log('Loaded middleware: logger');
};
