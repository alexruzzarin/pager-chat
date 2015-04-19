/**
 * Created by Alex on 3/21/2015.
 */
'use strict';

var glob = require('glob');

module.exports = function () {
    var environmentFiles = glob.sync('./config/env/' + process.env.NODE_ENV + '.js');

    if (!environmentFiles.length) {
        if (process.env.NODE_ENV) {
            console.error('No configuration file found for "%s" environment using development instead', process.env.NODE_ENV);
        } else {
            console.error('NODE_ENV is not defined! Using default development environment');
        }

        process.env.NODE_ENV = 'development';
    }
};