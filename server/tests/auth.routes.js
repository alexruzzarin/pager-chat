/**
 * Created by alex on 21/04/15.
 */
'use strict';

var app = require('../app');

require('../config/db').initModels();

var request = require('supertest'),
    should = require('chai').should(),
    mongoose = require('mongoose'),
    User = mongoose.model('User');

describe('Passport: routes', function () {

    var user;
    var password = 'password';
    var baseUrl = '/auth/signin';


    // This function will run before each test.
    beforeEach(function (done) {

        user = new User({
            firstName: 'Full',
            lastName: 'Name',
            displayName: 'Full Name',
            email: 'test@test.com',
            username: 'username',
            password: password,
            provider: 'local'
        });

        user.preparePassword();
        user.save(done);

    });
    afterEach(function(done) {
        User.remove().exec(done);
    });

    describe('POST /auth/signin', function () {
        it('should return the user if authentication works', function (done) {
            // post is what we will be sending to the /auth/local
            var post = {
                email: user.email,
                password: password
            };
            request(app)
                .post(baseUrl)
                .send(post)
				.expect('Content-Type', /json/)
				.expect(200, done)
                .end(function (err, res) {
                    should.not.exist(err);
                    // confirm the redirect
                    res.header.location.should.include('/account');
                    done();
                });
        });
        it('should redirect to "/signin" if authentication fails', function (done) {
            var post = {
                email: user.email,
                password: 'fakepassword'
            };
            request(app)
                .post(baseUrl)
                .send(post)
                .expect(302)
                .end(function (err, res) {
                    should.not.exist(err);
                    // confirm the redirect
                    res.header.location.should.include('/auth/signin');
                    done();
                });
        });
    });

});
