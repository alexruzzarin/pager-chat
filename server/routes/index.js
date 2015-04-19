/**
 * Created by alex on 19/04/15.
 */
'use strict';

module.exports=function(app){
    app.route('/').get(function(req,res){
        res.render('index');
    });
};