/**
 * Created by Alex on 23/04/2015.
 */
'use strict';

angular.module('pager-chat').controller('HeaderCtrl',
	function (Authentication, RoomsService) {
		var me = this;
		me.authentication = Authentication;
		me.rooms = RoomsService.getRooms();
	}
);
