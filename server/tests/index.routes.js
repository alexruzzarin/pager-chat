/**
 * Created by alex on 18/04/15.
 */
'use strict';

var request = require('supertest'),
    app = require('../app');

describe('Home page', function () {
    describe('when requesting the root /', function () {
        it('should respond with 200 and html', function (done) {
            request(app).get('/').expect('Content-Type', /html/).expect(200, done);
        });
    });
});
