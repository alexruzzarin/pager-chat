/**
 * Created by Alex on 22/04/2015.
 */
'use strict';
angular.module('pager-chat', ['ngRoute'])
	.constant("io", io)
	.run(function (Authentication, $location) {
		if (!Authentication.user) {
			$location.url('/signin');
		}
	});
