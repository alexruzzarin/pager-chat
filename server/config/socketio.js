/**
 * Created by Alex on 25/04/2015.
 */
var db = require('./db'),
	socketio = require('socket.io'),
	ioRedis = require('socket.io-redis'),
	sessionStore = require('./session-store')(db),
	passportSocketIo = require('passport.socketio'),
	config = require('./config');

module.exports = function (server) {
	var io = socketio(server);

	if (config.redis.uri.indexOf('localhost') >= 0) {
		io.adapter(ioRedis(config.redis.uri));
	} else {
		var redis = require('redis'),
			url = require('url'),
			redisURL = url.parse(config.redis.uri);

		var pub = redis.createClient(redisURL.port, redisURL.hostname, {no_ready_check: true}),
			sub = redis.createClient(redisURL.port, redisURL.hostname, {no_ready_check: true,detect_buffers: true});
		pub.auth(redisURL.auth.split(":")[1]);
		sub.auth(redisURL.auth.split(":")[1]);

		io.adapter(ioRedis({pubClient: pub, subClient: sub}));
	}

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

		io.sockets.emit('system', {text: socket.request.user.username + ' is online.'});

		socket.on('disconnect', function () {
			io.sockets.emit('system', {text: socket.request.user.username + ' is offline.'});
		});

		socket.on('room-join', function (data) {
			socket.join(data.room);
			socket.broadcast.to(data.room).emit('room-system', {
				room: data.room,
				text: socket.request.user.username + ' joined the room.'
			});
			socket.emit('room-join-result', {
				success: true,
				room: data.room
			});
		});
		socket.on('room-leave', function (data) {
			socket.leave(data.room);
			socket.broadcast.to(data.room).emit('room-system', {
				room: data.room,
				text: socket.request.user.username + ' leaves the room.'
			});
		});
		socket.on('room-message', function (data) {
			var e = {
				room: data.room,
				sender: socket.request.user.username,
				text: data.text
			};
			socket.broadcast.to(data.room).emit('room-message', e);
			socket.emit('room-message', e);
		});
	});

	return io;
};
