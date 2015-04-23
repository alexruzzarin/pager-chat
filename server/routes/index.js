/**
 * Created by alex on 19/04/15.
 */
'use strict';

var indexController = require('../controllers/index');

module.exports = function (app) {

	app.route('/').get(indexController.get);

	console.log('Loaded route: index');
};
