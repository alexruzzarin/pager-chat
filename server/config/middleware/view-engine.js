/**
 * Created by alex on 19/04/15.
 */
'use strict';
var consolidate = require('consolidate');

module.exports=function(app){
    app.engine('hbs', consolidate.handlebars);

    // Set views path and view engine
    app.set('view engine', 'hbs');
    app.set('views', './server/views');
};