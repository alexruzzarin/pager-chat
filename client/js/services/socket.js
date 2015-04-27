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
	socket.on('room-leave-result', function (data) {
		RoomsService.removeRoom(data.room);
		$location.path('/');
		$rootScope.$apply();
	});

	socket.on('room-message', function (data) {
		RoomsService.addRoomMessage(data.room, data);
		$rootScope.$apply();
	});
	socket.on('room-system', function (data) {
		data.sender = 'system';
		RoomsService.addRoomMessage(data.room, data);
		$rootScope.$apply();
	});

	var command = function (command, currentRoom) {
		socket.emit('command', {command: command, room: currentRoom});
	};
	var roomJoin = function (room) {
		if (room) {
			command('/join ' + room);
		}
	};
	var roomLeave = function (room) {
		if (room) {
			command('/leave ' + room);
		}
	};

	return {
		command: command,
		roomJoin: roomJoin,
		roomLeave: roomLeave
	};
});
