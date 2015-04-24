/**
 * Created by alex on 19/04/15.
 */
'use strict';
var heartbeatController = require('../controllers/heartbeat'),
	authController = require('../controllers/user-auth');

module.exports = function (app) {
	app.route('/api/heartbeat').get(heartbeatController.get);

	app.route('/auth/signup').post(authController.signup);
	app.route('/auth/signin').post(authController.signin);
	app.route('/auth/signout').get(authController.signout);

	console.log('Loaded route: api');
};
