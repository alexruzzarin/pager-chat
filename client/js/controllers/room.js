/**
 * Created by Alex on 26/04/2015.
 */
'use strict';
angular.module('pager-chat').controller('RoomCtrl', function ($routeParams, ChatSocket, RoomsService) {
	var room = $routeParams.room;
	if (!RoomsService.existRoom(room)) {
		ChatSocket.roomJoin(room);
		return;
	}

	var me = this;
	me.room = room;
	me.messages = RoomsService.getRoomMessages(room);

	me.commandSend = function () {
		if (me.commandToSend.length > 0) {
			ChatSocket.command(me.commandToSend, me.room);
			me.commandToSend = '';
		}
	}
});
