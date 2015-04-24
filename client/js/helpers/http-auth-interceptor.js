/**
 * Created by Alex on 24/04/2015.
 */
'use strict';

angular.module('pager-chat').config(function ($httpProvider) {
	$httpProvider.interceptors.push(function ($q, $location) {
		return {
			response: function (response) {
				// do something on success
				return response;
			},
			responseError: function (response) {
				if (response.status === 401)
					$location.url('/signin');
				return $q.reject(response);
			}
		};
	});
});
