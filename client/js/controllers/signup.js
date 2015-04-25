/**
 * Created by Alex on 24/04/2015.
 */
'use strict';

angular.module('pager-chat').controller('SignupCtrl', function (Authentication, $http, $location) {
	var me = this;
	if (Authentication.user) $location.path('/');

	me.credentials = {};
	me.signup = function () {
		$http.post('/auth/signup', me.credentials)
			.success(function (response) {
				// If successful we assign the response to the global user model
				Authentication.user = response;

				// And redirect to the index page
				$location.path('/');
			})
			.error(function (response) {
				me.error = response.message;
			});
	};
});
