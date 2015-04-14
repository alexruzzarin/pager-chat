/**
 * Created by Alex on 14/04/2015.
 */
'use strict';
var app = require('express')();

app.get('/api/heartbeat', function (req, res) {
    res.json();
});

module.exports = app;