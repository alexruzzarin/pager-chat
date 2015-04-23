/**
 * Created by alex on 19/04/15.
 */
'use strict';
var heartbeatController = require('../controllers/heartbeat');
module.exports = function (app) {
	app.route('/api/heartbeat').get(heartbeatController.get);

	console.log('Loaded route: api');
};
