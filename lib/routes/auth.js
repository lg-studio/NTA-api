var async = require('async');
var user = require('../database/user');
var _class = require('../database/class');
var uuid = require('node-uuid');
var HttpError = require('../util/middleware').HttpError;
var bcrypt = require('bcryptjs');
var crypto = require('crypto');
var mail = require('../util/mail');

var PWD_SALT = process.env.PWD_SALT || 8;
if(!process.env.PWD_SALT) console.log('Using standard PWD_SALT = 8');

/**
* Registeres new user in the system, binds him to _class
* and returns his data with token
*/
function register(req, res, done) {
    var model = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        password: req.body.password,
        code: req.body.code,
        token: uuid.v4(),
        registered: Date.now(),
        role: 'user'
        //gender: req.body.gender,
        //country: req.body.country,
        //language: req.body.language,
        //phone: req.body.phone,
        //birthday: req.body.birthday,
        //classes: req.body.classes
    }

    async.series([
        (next) => {
            user.findByEmail(req.body.email, (e, r) => {
                if(e) return done(new HttpError(500, e));
                if(r) return done(new HttpError(400, 'User with this id already exists'));

                next()
            })
        },
        (next) => {
            _class.findClassByCode(req.body.code, (e, r) => {
                if(e) return done(new HttpError(500, e));
                if(!r) return done(new HttpError(400, 'Class with this code does not exists'));

                model.classes = [r._id];
                next()
            })
        },
        (next) => {
            bcrypt.genSalt(PWD_SALT, function(e, salt) {
                if(e || !salt) return done(new HttpError(500, e));

                bcrypt.hash(req.body.password, salt, function(e, hash) {
                    if(e) return done(new HttpError(500, e));

                    model.password = hash;
                    next();
                });
            });
        },
        (next) => {
            user.createUser(model, (e, user) => {
                if(e) return done(new HttpError(500, e));
                if(!user) return done(new HttpError(400, 'Error when registering new user'));

                var user = {
                    id: user._id,
                    token: user.token,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    email: user.email,
                    classes: user.classes,
                    role: user.role,

                    gender: user.gender,
                    country: user.country,
                    language: user.language,
                    registered: user.registered,
                    phone: user.phone,             
                    birthday: user.birthday,
                }

                var message = {
                    to: user.email,
                    subject: 'Congratulations!',
                    text: 'Thank you for registering in our app!'
                }

                mail.send(message, (e, r) => {
                    if(e) return done(new HttpError(500, e));
                    if(!r) return done(new HttpError(400, 'Some error when sending password reset email'));

                    res.send(user);
                    next()
                })
            })
        }
    ])
}

/**
* Logins user in th system and returns his data with token
*/
function login(req, res, done) {
    var userId;

    async.series([
        (next) => {
            user.findByEmail(req.body.email, (e, r) => {
                if(e) return done(new HttpError(500, e));
                if(!r) return done(new HttpError(400, 'User does not exist'));

                bcrypt.compare(req.body.password, r.password, (e, result) => {
                    if(e) return done(new HttpError(500, e));
                    if(!result) return done(new HttpError(400, 'Password is incorrect'));

                    userId = r._id;
                    next();
                });
            })
        },
        (next) => {
            user.saveToken(userId, uuid.v4(), (e, r) => {
                if(e) return done(new HttpError(500, e));
                if(!r) return done(new HttpError(400, 'Error when saving token'));

                res.send({
                    id: r._id,
                    token: r.token,
                    first_name: r.first_name,
                    last_name: r.last_name,
                    email: r.email,
                    classes: r.classes,
                    role: r.role,

                    gender: r.gender,
                    country: r.country,
                    language: r.language,
                    registered: r.registered,
                    phone: r.phone,             
                    birthday: r.birthday, 
                });
            })
        }
    ])
}

/**
* Logouts user and removes token
*/
function logout(req, res, done) {
    async.series([
        (next) => {
            user.findUserByToken(req.headers.authorization, (e, r) => {
                if(e) return done(new HttpError(500, e));
                if(!r) return done(new HttpError(400, 'User doesn\'t exist or login/password pair is incorrect'));
                next()
            })
        },
        (next) => {
            user.removeToken(req.user._id, (e, r) => {
                if(e) return done(new HttpError(500, e));
                if(!r) return done(new HttpError(400, 'Error when removing token'));

                res.send();
                done()
            })
        }
    ])
}

/**
* Change password
*/ 
function changePassword(req, res, done) {
    user.findByEmail(req.body.email, (e, user) => {
        if(e) return done(new HttpError(500, e));
        if(!user) return done(new HttpError(400, 'User doesn\'t exist or login/password pair is incorrect'));

        bcrypt.compare(req.body.oldPassword, user.password, (e, result) => {
            if(e) return done(new HttpError(500, e));
            if(!result) return done(new HttpError(400, 'Current password is incorrect'));

            bcrypt.genSalt(PWD_SALT, function(e, salt) {
                if(e || !salt) return done(new HttpError(500, e));

                bcrypt.hash(req.body.newPassword, salt, function(e, hash) {
                    if(e) return done(new HttpError(500, e));
                    if(!hash) return done(new HttpError(400, 'Can not save new password'));

                    user.password = hash;
                    user.save();
                    res.send();
                    next();
                });
            });
        });
    })
}

/**
* Sends email to user to reset password
*/
function resetPassword(req, res, done) {
    var token;
    var currentUser;

    async.series([
        (next) => {
            crypto.randomBytes(20, function(err, buf) {
                token = buf.toString('hex');
                next(err, token);
            });
        },
        (next) => {
            user.findByEmail(req.body.email, (e, user) => {
                if(e) return done(new HttpError(500, e));
                if(!user) return done(new HttpError(400, 'User doesn\'t exist or login/password pair is incorrect'));
                
                currentUser = user;

                // set temporary token and expiration date
                user.resetPasswordToken = token;
                user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

                user.save(next)
            })
        },
        (next) => {
            // send mail notification to user
            var message = {
                to: currentUser.email,
                subject: 'Password reset',
                text:   'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                        'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                        'http://' + req.headers.host + '/password/reset/' + token + '\n\n' +
                        'If you did not request this, please ignore this email and your password will remain unchanged.\n'
            }

            mail.send(message, (e, r) => {
                if(e) return done(new HttpError(500, e));
                if(!r) return done(new HttpError(400, 'Some error when sending password reset email'));

                // res.status(200).send({ token: token })
                res.send();
                next()
            })
        }
    ]);
}

/**
* Checks reset password token expiration date
*/
function checkToken(req, res, done) {
    user.findByPasswordToken(req.params.token, (e, user) => {
        if(e) return done(new HttpError(500, e));
        if(!user) return done(new HttpError(400, 'Password reset token is expired or invalid'));

        res.redirect(req.headers.host + '/password/reset');
    })
}

/**
* Saves new password
*/
function saveNewPassword(req, res, done) {
    user.findByPasswordToken(req.body.token, (e, user) => {
        if(e) return done(new HttpError(500, e));
        if(!user) return done(new HttpError(400, 'Password reset token is expired or invalid'));

        bcrypt.genSalt(PWD_SALT, function(e, salt) {
            if(e || !salt) return done(new HttpError(500, e));

            bcrypt.hash(req.body.newPassword, salt, function(e, hash) {
                if(e) return done(new HttpError(500, e));
                if(!hash) return done(new HttpError(400, 'Can not save new password'));

                user.resetPasswordToken = null;
                user.resetPasswordExpires = null;
                user.password = hash;

                user.save( (e, r) => {
                    if(e) return done(new HttpError(500, e));

                    res.send()
                })
            });
        });
    })
}

module.exports = {
    register: register,
    login: login,
    logout: logout,

    changePassword: changePassword,
    resetPassword: resetPassword,
    checkToken: checkToken,
    saveNewPassword: saveNewPassword
}
