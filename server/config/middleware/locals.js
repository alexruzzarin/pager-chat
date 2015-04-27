/**
 * Created by Alex on 22/04/2015.
 */
'use strict';
var config = require('../config');
module.exports = function (app) {
	app.locals.development = process.env.NODE_ENV === 'development';
	app.locals.production = process.env.NODE_ENV !== 'development';
	app.locals.assetsSuffix = config.assetsSuffix;

	// Passing the request url to environment locals
	app.use(function (req, res, next) {
		res.locals.url = req.protocol + '://' + req.headers.host + req.url;
		next();
	});
};
