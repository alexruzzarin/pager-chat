/**
 * Created by Alex on 22/04/2015.
 */
'use strict';
angular.module('pager-chat', ['ngRoute'])
	.constant("io", io)
	.constant("moment", moment)
	.filter('momentFormat', function (moment) {
		return function (input, format) {

			if (!input) {
				return '';
			}
			if (angular.isDate(input)) {
				input = moment(input);
			}

			if (!input.isValid()) {
				return '';
			}

			if (!format) {
				format = 'L';
			}

			return input.format(format);
		};
	})
	.run(function (Authentication, $location) {
		if (!Authentication.user) {
			$location.url('/signin');
		}
	});
