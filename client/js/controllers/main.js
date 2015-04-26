/**
 * Created by Alex on 24/04/2015.
 */
'use strict';
angular.module('pager-chat').controller('MainCtrl', function (Authentication, $location, ChatSocket, SystemService) {
	if (!Authentication.user) {
		$location.path('/signin');
		return;
	}
	var me = this;

	me.notifications = SystemService.getNotifications();

	me.roomJoin = function () {
		ChatSocket.roomJoin(me.roomToJoin);
	}
});
