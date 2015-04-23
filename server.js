'use strict';
/**
 * Module dependencies.
 */
require('./server/config/init')();

var config = require('./server/config/config'),
	db = require('./server/config/db');

// Init the express application
var app = require('./server/config/express')(db);

// Bootstrap passport config
require('./server/config/passport')();

// Start the app by listening on <port>
app.listen(config.port,function(){
	console.log('Listening!');
});

// Expose app
module.exports = app;

// Logging initialization
console.log('--');
console.log('Pager-Chat application started');
console.log('Environment:\t\t%s', process.env.NODE_ENV);
console.log('Port:\t\t\t\t%s', config.port);
console.log('Database:\t\t\t%s', config.db.uri);
console.log('--');
