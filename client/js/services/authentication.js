/**
 * Created by Alex on 24/04/2015.
 */
angular.module('pager-chat').factory('Authentication', function ($window) {
	var auth = {
		user: $window.user
	};

	return auth;
});
