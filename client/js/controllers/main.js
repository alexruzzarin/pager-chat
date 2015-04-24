/**
 * Created by Alex on 24/04/2015.
 */
'use strict';
angular.module('pager-chat').controller('MainCtrl', function (Authentication) {
	if (!Authentication.user) $location.path('/');
});
