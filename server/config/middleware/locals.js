/**
 * Created by Alex on 22/04/2015.
 */
'use strict';

module.exports = function (app) {
	app.locals.development = process.env.NODE_ENV === 'development';
	app.locals.production = process.env.NODE_ENV !== 'development';

	// Passing the request url to environment locals
	app.use(function (req, res, next) {
		res.locals.url = req.protocol + '://' + req.headers.host + req.url;
		next();
	});
};
