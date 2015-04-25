/**
 * Created by Alex on 24/04/2015.
 */
'use strict';
angular.module('pager-chat').controller('MainCtrl', function (Authentication, $location) {
	if (!Authentication.user) $location.path('/signin');
});
