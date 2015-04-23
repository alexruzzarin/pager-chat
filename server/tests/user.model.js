/**
 * Created by Alex on 21/04/2015.
 */

'use strict';

require('../config/db').initModels();

var should = require('chai').should(),
    mongoose = require('mongoose'),
    User = mongoose.model('User');

var user, user2;

describe('User Model Unit Tests:', function() {
    before(function(done) {
        user = new User({
            firstName: 'Full',
            lastName: 'Name',
            displayName: 'Full Name',
            email: 'test@test.com',
            username: 'username',
            password: 'password',
            provider: 'local'
        });
        user2 = new User({
            firstName: 'Full',
            lastName: 'Name',
            displayName: 'Full Name',
            email: 'test@test.com',
            username: 'username',
            password: 'password',
            provider: 'local'
        });

        done();
    });

    describe('Method Save', function() {
        it('should begin with no users', function(done) {
            User.find({}, function(err, users) {
                users.should.have.length(0);
                done();
            });
        });

        it('should be able to save without problems', function(done) {
            user.save(done);
        });

        it('should fail to save an existing user again', function(done) {
            user.save(function() {
                user2.save(function(err) {
                    should.exist(err);
                    done();
                });
            });
        });

        it('should be able to show an error when try to save without first name', function(done) {
            user.firstName = '';
            return user.save(function(err) {
                should.exist(err);
                done();
            });
        });
    });

    describe('Method authenticate', function() {
        it('should return true if password is valid', function (done) {
            var password = 'password';
            user.preparePassword();
            user.save(function(){
                user.authenticate(password).should.equal(true);
                done();
            });
        });

        it('should return false if password is invalid', function () {
            var password = 'secret';
            user.preparePassword();
            user.save(function(){
                user.authenticate(password).should.equal(false);
                done();
            });
        });
    });

    after(function(done) {
        User.remove().exec(done);
    });
});
