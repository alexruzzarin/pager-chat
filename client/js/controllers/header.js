/**
 * Created by Alex on 23/04/2015.
 */
'use strict';

angular.module('pager-chat').controller('HeaderCtrl',
	function (Authentication, RoomsService, $location) {
		var me = this;
		me.authentication = Authentication;
		me.rooms = RoomsService.getRooms();
		me.isActive = function (viewLocation) {
			return viewLocation === $location.path();
		};
	}
);
