/**
 * Created by alex on 19/04/15.
 */
var app = require('./server/app')(),
    config = require('./server/config/config');

app.listen(config.port, function() {
    console.log("Node app is running at localhost:" + app.get('port'))
});