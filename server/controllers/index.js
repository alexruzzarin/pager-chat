/**
 * Created by Alex on 22/04/2015.
 */
'use strict';


module.exports.get = function(req, res) {
	res.render('index', {
		user: req.user || null,
		request: req
	});
};
