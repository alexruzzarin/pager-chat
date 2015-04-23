/**
 * Created by Alex on 22/04/2015.
 */
'use strict';

var compression = require('compression');

module.exports = function (app) {
	// Should be placed before express.static
	app.use(compression({
		// only compress files for the following content types
		filter: function (req, res) {
			return (/json|text|javascript|css/).test(res.getHeader('Content-Type'));
		},
		// zlib option for compression level
		level: 3
	}));

	console.log('Loaded middleware: compression');
};
