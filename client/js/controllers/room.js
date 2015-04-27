/**
 * Created by Alex on 26/04/2015.
 */
'use strict';
angular.module('pager-chat').controller('RoomCtrl', function ($location, Authentication, $routeParams, ChatSocket, RoomsService) {
	if (!Authentication.user) {
		$location.path('/signin');
		return;
	}
	var room = $routeParams.room;
	if (!RoomsService.existRoom(room)) {
		ChatSocket.roomJoin(room);
		$location.path('/');
		return;
	}

	var me = this;
	me.room = room;
	me.username = Authentication.user.username;
	me.messages = RoomsService.getRoomMessages(room);

	me.leave = function () {
		ChatSocket.command('/leave', me.room);
	};

	me.commandSend = function () {
		if (me.commandToSend.length > 0) {
			ChatSocket.command(me.commandToSend, me.room);
			me.commandToSend = '';
		}
	}
});
