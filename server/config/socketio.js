/**
 * Created by Alex on 25/04/2015.
 */
var db = require('./db'),
	socketio = require('socket.io'),
	ioRedis = require('socket.io-redis'),
	sessionStore = require('./session-store')(db),
	passportSocketIo = require('passport.socketio'),
	config = require('./config'),
	User = require('mongoose').model('User'),
	Room = require('mongoose').model('Room'),
	_ = require('lodash'),
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

			Room.update({users: socket.request.user.username}, {$pop: {users: socket.request.user.username}}, function (err, rooms) {
				if (err) {
					console.log(err);
					return;
				}
				console.log(rooms);
			});
		});

		var roomJoinResult = function (room) {
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
			listRooms();
		};
		var roomJoinUser = function (room) {
			var user = socket.request.user;
			if (!_.contains(user.rooms, room)) {
				user.rooms.push(room);

				user.save(function (err) {
					if (err)return;

					roomJoinResult(room);
				});
			} else {
				roomJoinResult(room);
			}
		};
		var roomJoin = function (room) {
			if (!/^[a-zA-Z0-9_-]*$/.test(room)) {
				io.sockets.emit('system', {text: room + ' is not a valid room name.'});
				return;
			}
			var user = socket.request.user;

			Room.findOne({name: room}, function (err, dbroom) {
				if (err) return;

				if (dbroom) {
					if (dbroom.private && !_.contains(dbroom.invitedUsers, user.username)) {
						io.sockets.emit('system', {text: socket.request.user.username + ' is not invited to ' + room + '.'});
						return;
					}
				} else {
					dbroom = new Room({
						name: room,
						owner: user.username
					});
				}
				if (!_.contains(dbroom.users, user.username)) {
					dbroom.users.push(user.username);
				}
				dbroom.save(function (err) {
					if (err)return;
					roomJoinUser(room);
				})
			});


		};
		var roomLeaveResult = function (room) {
			socket.leave(room);
			socket.broadcast.to(room).emit('room-system', {
				room: room,
				text: socket.request.user.username + ' leaves the room.',
				time: Date.now
			});
			socket.emit('room-leave-result', {
				room: room
			});
			listRooms();
		};
		var roomLeave = function (room) {
			var user = socket.request.user;
			Room.findOne({name: room}, function (err, dbroom) {
				if (!err && dbroom) {
					if (_.contains(dbroom.users, user.username)) {
						dbroom.users.pop(user.username);
						dbroom.save();
					}
				}
			});
			if (_.contains(user.rooms, room)) {
				user.rooms.pop(room);
				user.save(function (err) {
					if (err)return;
					roomLeaveResult(room);
				});
			} else {
				roomLeaveResult(room);
			}
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

			io.sockets.in(room).emit('room-message', e);
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
		var roomPrivate = function (room, private) {
			var sender = socket.request.user.username;
			Room.findOne({name: room}, function (err, dbroom) {
				if (err || !dbroom) return;
				if (dbroom.owner !== sender) {
					socket.emit('room-system', {
						room: room,
						text: 'Only the owner can config the room.',
						time: Date.now
					});
					return;
				}
				dbroom.private = private;
				if (private) {
					dbroom.invitedUsers = dbroom.users;
				} else {
					dbroom.invitedUsers = [];
				}
				dbroom.save(function (err) {
					if (err)return;
					socket.emit('room-system', {
						room: room,
						text: private ? 'This room is private now.' : 'This room is public now.',
						time: Date.now
					});
					if (private) {
						roomListInvite(room);
					}
				});
			});
		};
		var roomInvite = function (room, username) {
			var sender = socket.request.user.username;
			Room.findOne({name: room}, function (err, dbroom) {
				if (err || !dbroom) return;
				if (dbroom.owner !== sender) {
					socket.emit('room-system', {
						room: room,
						text: 'Only the owner can config the room.',
						time: Date.now
					});
					return;
				}
				if (dbroom.private && !_.contains(dbroom.invitedUsers, username)) {
					dbroom.invitedUsers.push(username);
					dbroom.save(function (err) {
						if (err)return;

						roomListInvite(room);
					});
				}
			});
		};
		var roomUninvite = function (room, username) {
			var sender = socket.request.user.username;
			Room.findOne({name: room}, function (err, dbroom) {
				if (err || !dbroom) return;
				if (dbroom.owner !== sender) {
					socket.emit('room-system', {
						room: room,
						text: 'Only the owner can config the room.',
						time: Date.now
					});
					return;
				}
				if (dbroom.private && _.contains(dbroom.invitedUsers, username)) {
					dbroom.invitedUsers.pop(username);
					dbroom.save(function (err) {
						if (err)return;

						roomListInvite(room);
					});
				}
			});
		};
		var roomListInvite = function (roomName) {
			Room.findOne({name: roomName}, function (err, dbroom) {
				if (err || !dbroom) return;
				if (dbroom.private) {
					socket.emit('room-system', {
						room: roomName,
						text: 'Invited users: ' + dbroom.invitedUsers.join(', '),
						time: Date.now
					});
				}
			});
		};
		var roomListUsers = function (roomName) {
			Room.findOne({name: roomName}, function (err, dbroom) {
				if (err || !dbroom) return;
				socket.emit('room-system', {
					room: roomName,
					text: 'Users: ' + dbroom.users.join(', '),
					time: Date.now
				});
			});
		};
		var listRooms = function () {
			Room.find({}, function (err, rooms) {
				if (err)return;
				io.sockets.emit('rooms', rooms);
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
					case '/private-on':
						roomPrivate(data.room, true);
						break;
					case '/private-off':
						roomPrivate(data.room, false);
						break;
					case '/invite':
						if (c.length > 1) {
							roomInvite(data.room, c[1]);
						}
						break;
					case '/uninvite':
						if (c.length > 1) {
							roomUninvite(data.room, c[1]);
						}
						break;
					case '/list-invited':
						roomListInvite(data.room);
						break;
					case '/list-users':
						roomListUsers(data.room);
						break;
					default:
						roomMessage(data.room, data.command);
				}
			} else {
				roomMessage(data.room, data.command);
			}
		});

		listRooms();
	});

	return io;
};
