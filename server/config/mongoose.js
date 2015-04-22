/**
 * Created by Alex on 21/04/2015.
 */
'use strict';
var mongoose = require('mongoose'),
    path = require('path'),
    config = require('./config');

// Bootstrap db connection
var db = mongoose.connect(config.db.uri, config.db.options, function (err) {
    if (err) {
        console.error('Could not connect to MongoDB!');
        console.log(err);
    }
});
mongoose.connection.on('error', function (err) {
        console.error('MongoDB connection error: ' + err);
        process.exit(-1);
    }
);

db.initModels = function() {
    config.getGlobbedFiles('./server/models/**/*.js').forEach(function(modelPath){
        require(path.resolve(modelPath));
    });
};
module.exports = db;