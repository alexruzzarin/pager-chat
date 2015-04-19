/**
 * Created by alex on 19/04/15.
 */
'use strict';

module.exports=function(app){
    app.route('/api/heartbeat').get(function (req, res) {
        res.json();
    });
};