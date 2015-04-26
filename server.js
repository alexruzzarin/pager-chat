'use strict';

var http = require('http'),
	app = require('./server/app'),
	config = require('./server/config/config');

var server = http.Server(app);
var io = require('./server/config/socketio')(server);

// Start the app by listening on <port>
server.listen(config.port, function () {
	console.log('Listening!');
});

// Logging initialization
console.log('--');
console.log('Pager-Chat application started');
console.log('Environment:\t\t%s', process.env.NODE_ENV);
console.log('Port:\t\t\t\t%s', config.port);
console.log('Database:\t\t\t%s', config.db.uri);
console.log('--');
