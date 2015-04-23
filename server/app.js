/**
 * Created by Alex on 23/04/2015.
 */
'use strict';

require('./config/init')();

var config = require('./config/config'),
	db = require('./config/db');

// Init the express application
var app = require('./config/express')(db);

// Bootstrap passport config
require('./config/passport')();

// Expose app
module.exports = app;
