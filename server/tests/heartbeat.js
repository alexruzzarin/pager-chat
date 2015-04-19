/**
 * Created by Alex on 14/04/2015.
 */
'use strict';

var request = require('supertest'),
    app = require('../app')();

describe('heartbeat api', function () {
    describe('when requesting resource /api/heartbeat', function () {
        it('should respond with 200', function (done) {
            request(app).get('/api/heartbeat').expect('Content-Type', /json/).expect(200, done);
        });
    });
});