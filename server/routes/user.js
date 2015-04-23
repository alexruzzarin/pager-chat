/**
 * Created by Alex on 23/04/2015.
 */
'use strict';
var authController = require('../controllers/user-auth');

module.exports = function (app) {
	// Setting up the users authentication api
	app.route('/auth/signup').post(authController.signup);
	app.route('/auth/signin').post(authController.signin);
	app.route('/auth/signout').get(authController.signout);
};
