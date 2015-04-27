/**
 * Created by Alex on 27/04/2015.
 */
'use strict';
angular.module('pager-chat').directive('autoHeight', function ($window) {
	return {
		restrict: 'A',
		link: function (scope, element) {
			var headerAndFooter = 225;
			scope.initializeWindowSize = function () {
				$(element).css('height', $window.innerHeight - headerAndFooter);
			};
			scope.initializeWindowSize();
			angular.element($window).bind('resize', function () {
				scope.initializeWindowSize();
			});
		}
	};
});
