/**
 * Created by Alex on 26/04/2015.
 */
'use strict';
angular.module('pager-chat').factory('ChatSocket', function (io, $window, $rootScope, $location, RoomsService, SystemService) {
	var socket = io.connect('//' + $window.location.host);

	socket.on('system', function (data) {
		SystemService.addNotification(data);
		$rootScope.$apply();
	});

	socket.on('room-join-result', function (data) {
		if (data.success) {
			var link = RoomsService.addRoom(data.room);
			$location.path(link);
			$rootScope.$apply();
		}
	});

	socket.on('room-message', function (data) {
		RoomsService.addRoomMessage(data.room, {sender: data.sender, text: data.text});
		$rootScope.$apply();
	});
	socket.on('room-system', function (data) {
		RoomsService.addRoomMessage(data.room, {sender: 'system', text: data.text});
		$rootScope.$apply();
	});

	var roomMessage = function (room, text) {
		socket.emit('room-message', {room: room, text: text});
	};
	var roomJoin = function (room) {
		socket.emit('room-join', {room: room});
	};
	var roomLeave = function (room) {
		socket.emit('room-join', {room: room});
		RoomsService.removeRoom(room);
		$location.path('/');
	};

	return {
		command: function (command, currentRoom) {
			if (command.indexOf('/') === 0) {
				var c = command.split(' ');
				var action = c[0].toLowerCase();
				switch (action) {
					case '/join':
						if (c.length === 2)
							roomJoin(c[1]);
						break;
					case '/leave':
						if (c.length === 1) {
							roomLeave(currentRoom);
						}
						else if (c.length === 2) {
							roomLeave(c[1]);
						}
						break;
					default :
						roomMessage(currentRoom, command);
						break;
				}
			}
			else {
				roomMessage(currentRoom, command);
			}
		},
		roomJoin: roomJoin,
		roomLeave: roomLeave
	};
});
