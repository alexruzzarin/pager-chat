/**
 * Created by Alex on 26/04/2015.
 */
'use strict';
angular.module('pager-chat').service('SystemService', function () {
	this.notifications = [];

	this.getNotifications = function () {
		return this.notifications;
	};

	this.addNotification = function (data) {
		this.notifications.push(data);
	}
});
