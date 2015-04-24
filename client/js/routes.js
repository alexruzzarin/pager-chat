/**
 * Created by Alex on 24/04/2015.
 */
'use strict';
angular.module('pager-chat').config(function ($routeProvider) {
	$routeProvider
		.when('/', {
			templateUrl: '/views/main.html',
			controller: 'MainCtrl'
		})
		.when('/admin', {
			templateUrl: 'views/admin.html',
			controller: 'AdminCtrl'
		})
		.when('/signin', {
			templateUrl: 'views/signin.html',
			controller: 'LoginCtrl'
		})
		.otherwise({
			redirectTo: '/'
		});
});
