/**
 * Created by Alex on 25/04/2015.
 */
var db = require('./db'),
	socketio = require('socket.io'),
	sessionStore = require('./session-store')(db),
	passportSocketIo = require('passport.socketio'),
	config = require('./config');

module.exports = function (server) {
	var io = socketio(server);

	io.use(passportSocketIo.authorize({
		cookieParser: require('cookie-parser'),       // the same middleware you registrer in express
		key: config.sessionName,       // the name of the cookie where express/connect stores its session_id
		secret: config.sessionSecret,    // the session_secret to parse the cookie
		store: sessionStore,        // we NEED to use a sessionstore. no memorystore please
		success: onAuthorizeSuccess,  // *optional* callback on success - read more below
		fail: onAuthorizeFail     // *optional* callback on fail/error - read more below
	}));

	function onAuthorizeSuccess(data, accept) {
		console.log('successful connection to socket.io');

		accept();
	}

	function onAuthorizeFail(data, message, error, accept) {
		if (error)
			throw new Error(message);
		console.log('failed connection to socket.io:', message);

		// If you don't want to accept the connection
		if (error)
			accept(new Error(message));
		// this error will be sent to the user as a special error-package
		// see: http://socket.io/docs/client-api/#socket > error-object
	}

	io.sockets.on('connection', function (socket) {
		socket.emit('user-connected', {user: 'world'});
		socket.on('my other event', function (data) {
			console.log(data);
		});
	});

	return io;
};
