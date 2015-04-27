/**
 * Created by Alex on 26/04/2015.
 */
'use strict';
angular.module('pager-chat').service('SystemService', function () {
	var me = this;
	me.notifications = [];

	me.getNotifications = function () {
		return me.notifications;
	};

	me.addNotification = function (data) {
		me.notifications.push(data);
	};

	me.rooms = [];

	me.getRooms = function () {
		return me.rooms;
	};

	me.setRooms = function (data) {
		me.rooms.length = 0;
		data.forEach(function (r) {
			me.rooms.push(r);
		});
	};
});
