/**
 * Created by alex on 18/04/15.
 */
'use strict';

module.exports = {
    port: process.env.PORT || 3000,
    db: {
        uri: 'mongodb://localhost/pager-chat',
        options: {
            user: '',
            pass: ''
        }
    }
};