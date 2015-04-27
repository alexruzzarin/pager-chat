/**
 * Created by Alex on 25/04/2015.
 */
var db = require('./db'),
	socketio = require('socket.io'),
	ioRedis = require('socket.io-redis'),
	sessionStore = require('./session-store')(db),
	passportSocketIo = require('passport.socketio'),
	config = require('./config'),
	RestClient = require('node-rest-client').Client,
	restClient = new RestClient();

restClient.registerMethod("randomGiphy", "http://api.giphy.com/v1/gifs/random", "GET");

module.exports = function (server) {
	var io = socketio(server);

	if (config.redis.uri.indexOf('localhost') >= 0) {
		io.adapter(ioRedis(config.redis.uri));
	} else {
		var redis = require('redis'),
			url = require('url'),
			redisURL = url.parse(config.redis.uri);

		var pub = redis.createClient(redisURL.port, redisURL.hostname, {no_ready_check: true}),
			sub = redis.createClient(redisURL.port, redisURL.hostname, {no_ready_check: true, detect_buffers: true});
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

		var roomJoin = function (room) {
			socket.join(room);
			socket.broadcast.to(room).emit('room-system', {
				room: room,
				text: socket.request.user.username + ' joined the room.',
				time: Date.now
			});
			socket.emit('room-join-result', {
				success: true,
				room: room
			});
		};
		var roomLeave = function (room) {
			socket.leave(room);
			socket.broadcast.to(room).emit('room-system', {
				room: room,
				text: socket.request.user.username + ' leaves the room.',
				time: Date.now
			});
			socket.emit('room-leave-result', {
				room: room
			});
		};
		var roomMessage = function (room, text, type) {
			var e = {
				room: room,
				sender: socket.request.user.username,
				text: text,
				time: Date.now,
				type: 'text'
			};
			if (type) {
				e.type = type;
			}

			socket.broadcast.to(room).emit('room-message', e);
			socket.emit('room-message', e);
		};
		var roomGiphy = function (room, keyword) {
			var args = {
				parameters: {api_key: "dc6zaTOxFJmzC", tag: keyword}
			};
			var req = restClient.methods.randomGiphy(args, function (data, response) {
				if (data && data.data && data.data.fixed_height_downsampled_url) {
					roomMessage(room, data.data.fixed_height_downsampled_url, 'image');
				}
			});
			req.on('error', function (err) {
				socket.emit('system', {
					text: 'Giphy API error.'
				});
			});
		};

		socket.on('command', function (data) {
			if (!data.command || data.command.length === 0) {
				return;
			}
			if (data.command[0] === '/') {
				var c = data.command.split(' ');
				var command = c[0].toLowerCase();
				switch (command) {
					case '/join':
						if (c.length > 1) {
							roomJoin(c[1]);
						}
						break;
					case '/leave':
						if (c.length > 1) {
							roomLeave(c[1]);
						} else {
							roomLeave(data.room);
						}
						break;
					case '/giphy':
						if (c.length > 1) {
							roomGiphy(data.room, c[1]);
						}
						break;
					default:
						roomMessage(data.room, data.command);
				}
			} else {
				roomMessage(data.room, data.command);
			}
		})
	});

	return io;
};
