/**
 * Created by alex on 19/04/15.
 */

'use strict';

var express = require('express'),
    config = require('./config'),
    path = require('path');

module.exports = function () {
    // Initialize express app
    var app = express();

    // Setting application local variables
    //app.locals.assetsSuffix = config.assetsSuffix;
    //app.locals.livereload = config.livereload;

    // Passing the request url to environment locals
    app.use(function (req, res, next) {
        res.locals.url = req.protocol + '://' + req.headers.host + req.url;
        next();
    });

    // Showing stack errors
    app.set('showStackError', true);

    require('./middleware/view-engine')(app); //Configura ECT como render de express
    //require('./middleware/logger')(app);
    //require('./middleware/security')(app); // Remove y agrega encabezados HTTP para seguridad
    //require('./middleware/parsers')(app); // parsers de request para json, querystring, cookies, ...

    // Setting the app router and static folder
    app.use(express.static(path.resolve('./public')));

    // Globbing routing files
    config.getGlobbedFiles('./server/routes/**/*.js').forEach(function (routePath) {
        require(path.resolve(routePath))(app);
    });

    // Assume 'not found' in the error msgs is a 404. this is somewhat silly, but valid, you can do whatever you like, set properties, use instanceof etc.
    app.use(function (err, req, res, next) {
        // If the error object doesn't exists
        if (!err) return next();

        // Log it
        console.error(err.stack);

        // Error page
        res.status(500).render('500', {
            error: err.stack
        });
    });

    // Assume 404 since no middleware responded
    app.use(function (req, res) {
        res.status(404).render('404', {
            url: req.originalUrl,
            error: 'error.not-found'
        });
    });

    // Return Express server instance
    return app;
};