'use strict';
var passport = require('passport');

module.exports.signup = function (req, res) {

};
module.exports.signin = function (req, res, next) {
	passport.authenticate('local', function (err, user, info) {
		if (err || !user) {
			res.status(400).send(info);
		} else {
			// Remove sensitive data before login
			user.password = undefined;
			user.salt = undefined;

			req.login(user, function (err) {
				if (err) {
					res.status(400).send(err);
				} else {
					res.json(user);
				}
			});
		}
	})(req, res, next);
};
module.exports.signout = function (req, res) {

};
