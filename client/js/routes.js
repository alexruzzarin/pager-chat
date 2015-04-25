/**
 * Created by Alex on 24/04/2015.
 */
'use strict';
angular.module('pager-chat').config(function ($locationProvider, $routeProvider) {
	$locationProvider.html5Mode(true);
	$locationProvider.hashPrefix('!');

	$routeProvider
		.when('/', {
			templateUrl: '/views/main.html',
			controller: 'MainCtrl',
			controllerAs: 'main'
		})
		.when('/signin', {
			templateUrl: 'views/signin.html',
			controller: 'SigninCtrl',
			controllerAs: 'signin'
		})
		.when('/signup', {
			templateUrl: 'views/signup.html',
			controller: 'SignupCtrl',
			controllerAs: 'signup'
		})
		.otherwise({
			redirectTo: '/'
		});
});
