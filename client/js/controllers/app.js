/**
 * Created by Alex on 24/04/2015.
 */
'use strict';
angular.module('pager-chat').controller('AppCtrl', function ($rootScope) {
	var me = this;
	$rootScope.$on("$routeChangeStart", function () {
		me.loading = true;
	});

	$rootScope.$on("$routeChangeSuccess", function () {
		me.loading = false;
	});
});
