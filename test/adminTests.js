var superagent = require('superagent');
var _ = require('underscore');
var app = require('../app');
var assert = require('chai').assert;
var fs = require('fs');

var API_ROOT = 'http://localhost:3000';
var testImage = fs.readFileSync(__dirname + '/util/images/default.png');

var user;

describe('Auth - Auth API', function() {
    it('Returns registered user', function(done) {
        superagent.post(API_ROOT + '/v1/register')
            .send({
                first_name: "Test",
                last_name: "Test",
                email: "test@t.t",
                password: "12345",
                code: 12345,
                role: 'admin',

                classes: [],
                gender: 'Male',
                country: 'Ukraine',
                phone: '0 000 00000',
                birthday: Date.now() - 3600
            })
            .end(function(err, res) {
                user = res.body;

                assert.equal(res.status, 200);
                assert.deepEqual({
                    first_name: user.first_name,
                    last_name: user.last_name,
                    email: user.email,
                    role: user.role
                }, {
                    first_name: 'Test',
                    last_name: 'Test',
                    email: 'test@t.t',
                    role: 'user'
                });

                done();
            });
    });

    //it('Returns error because user already exists', function(done) {
    //    superagent.post(API_ROOT + '/v1/register')
    //        .send({
    //            first_name: "Test",
    //            last_name: "Test",
    //            email: "test@t.t",
    //            password: "12345",
    //            code: 12345
    //        })
    //        .end(function(err, res) {
    //            assert.equal(res.status, 400);
    //            assert.deepEqual(res.body, {
    //                error: 'User with this id already exists'
    //            });
    //
    //            done();
    //        });
    //});

    //it('Logouts user from the system', function(done) {
    //    superagent.post(API_ROOT + '/v1/logout')
    //        .set('Authorization', user.token)
    //        .end(function(err, res) {
    //            assert.equal(res.status, 200);
    //
    //            done();
    //        });
    //});

    it('Logs user and returns logged user information', function(done) {
        superagent.post(API_ROOT + '/v1/login')
            .send({
                email: "admin@ex.com",
                password: "admin"
            })
            .end(function(err, res) {
                user = res.body;

                assert.equal(res.status, 200);
                assert.deepEqual({
                    first_name: user.first_name,
                    last_name: user.last_name,
                    email: user.email,
                    role: user.role,

                    gender: user.gender,
                    country: user.country,
                    language: user.language,
                    phone: user.phone
                }, {
                    first_name: 'Super',
                    last_name: 'Admin',
                    email: 'admin@ex.com',
                    role: 'admin',

                    gender: 'Male',
                    country: 'USA',
                    language: 'English',
                    phone: '+0 000 12345678'
                });

                done();
            });
    });
});

describe('v1/admin/user - User API', function() {
    it.skip('Returns logged user information', function(done) {
        superagent.get(API_ROOT + '/v1/user')
            .set('Authorization', user.token)
            .end(function(err, res) {
                assert.equal(res.status, 200);
                assert.deepEqual({
                    first_name: user.first_name,
                    last_name: user.last_name,
                    email: user.email,
                    role: user.role
                }, {
                    first_name: 'Test',
                    last_name: 'Teacher',
                    email: 'testteacher@ex.com',
                    role: 'teacher'
                });

                done();
            });
    });

    it('Uploads test image for current user', function(done) {
        superagent.get(API_ROOT + '/v1/admin/users/')
            .set('Authorization', user.token)
            .end( (e, r) => {
                assert.equal(r.status, 200);

                assert.deepEqual({
                    first_name: user.first_name,
                    last_name: user.last_name,
                    email: user.email,
                    role: user.role
                }, {
                    first_name: 'Test',
                    last_name: 'Teacher',
                    email: 'testteacher@ex.com',
                    role: 'teacher'
                });

                done();
            });
    });

    it.skip('Uploads test image for current user', function(done) {
        superagent.get(API_ROOT + '/v1/image/user/' + user.id)
            .set('Authorization', user.token)
            .end( (e, r) => {
                assert.equal(r.status, 200);
                assert.equal(r.headers['content-type'], 'image/png');
                assert.equal(r.headers['content-length'], testImage.length);
                assert.deepEqual(r.body, testImage);

                done();
            });
    });
});
