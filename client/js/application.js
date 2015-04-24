/**
 * Created by Alex on 22/04/2015.
 */
'use strict';
angular.module('pager-chat', ['ngRoute'])
	.run(function (Authentication, $location) {
		if (!Authentication.user) {
			$location.url('/signin');
		}
	});
