var user = require('../database/user');
var _class = require('../database/class');
var idValidation = require('../util/middleware').idValidation;
var HttpError = require('../util/middleware').HttpError;
var _ = require('underscore');
var async = require('async');
var bcrypt = require('bcryptjs');
var mail = require('../util/mail');

var PWD_SALT = process.env.PWD_SALT || 8;
if(!process.env.PWD_SALT) console.log('Using standard PWD_SALT = 8');

/**
* Returns all users from the system
*/
function getAllUsers(req, res, done) {
    user.findAllUsers((e, r) => {
        if(e) return done(new HttpError(500, e));

        r = _.map(r, (e) => {
            return {
                id: e._id,
                first_name: e.first_name,
                last_name: e.last_name,
                email: e.email,
                classes: e.classes,
                role: e.role,

                gender: e.gender,
                country: e.country,
                language: e.language,
                registered: e.registered,
                phone: e.phone,
                birthday: e.birthday
            }
        });

        res.send(r)
    })
}

/**
* Returns all users from the system
*/
function getUserById(req, res, done) {
    user.findUserById(req.params.userId, (e, r) => {
        if(e) return done(new HttpError(500, e));
        if(!r) return done(new HttpError(400, 'User with this Id does not exist'));

        res.send({
            id: r._id,
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
            birthday: r.birthday
        })
    })
}

/**
* Creates user in the system
*/
function createUser(req, res, done) {
    var model = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        role: req.body.role,
        password: '12345',  // temporary password

        gender: req.body.gender,
        country: req.body.country,
        language: req.body.language,
        registered: Date.now(),
        phone: req.body.phone, 
        birthday: req.body.birthday,
        classes: _.uniq(req.body.classes)
    }

    var createdUser = {}

    async.series([
        (next) => {
            user.findByEmail(req.body.email, (e, r) => {
                if(e) return done(new HttpError(500, e));
                if(r) return done(new HttpError(400, 'User already exists'));
                next()
            })
        },
        (next) => {
            bcrypt.genSalt(PWD_SALT, function(e, salt) {
                if(e || !salt) return done(new HttpError(500, e));

                bcrypt.hash(model.password, salt, function(e, hash) {
                    if(e) return done(new HttpError(500, e));
                    if(!hash) return done(new HttpError(400, 'Can not save new password'));

                    model.password = hash;
                    next();
                });
            });
        },
        (next) => {
            user.createUser(model, (e, r) => {
                if(e) return done(new HttpError(500, e));
                if(!r) return done(new HttpError(400, 'Can not create user'));

                createdUser = {
                    id: r._id,
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
                }
                next()
            })
        },
        (next) => {
            var tasks = [];

            _.each(createdUser.classes, (e) => {
                tasks.push( (next) => {
                    _class.addUserToClass(createdUser.id, e, (e, r) => {
                       if(e) return done(new HttpError(500, e));
                       if(!r) return done(new HttpError(400, 'Class does not exists'));
                       next()
                   })
                })
            })

            async.parallel(tasks, next);
        },
        (next) => {
            var message = {
                to: createdUser.email,
                subject: 'Congratulations!',
                text: 'You was registered in NY Travel App by admin. \n\n' +
                        'Your login: ' + createdUser.email + '\n' +
                        'Your temporary password: 12345\n\n' + 
                        'Please change your password to own as soon as possible.'
            }

            mail.send(message, (e, r) => {
                if(e) return done(new HttpError(500, e));
                if(!r) return done(new HttpError(400, 'Some error when sending password reset email'));

                next()
            })
            res.send(createdUser);
        }
    ])
}

/**
* Updates user data in the system
*/
function updateUser(req, res, done) {
    var model = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        role: req.body.role,

        gender: req.body.gender,
        country: req.body.country,
        language: req.body.language,
        phone: req.body.phone,
        birthday: req.body.birthday,
        classes: _.uniq(req.body.classes)
    }

    user.updateUser(req.params.userId, null, model, (e, r) => {
        if(e) return done(new HttpError(500, e));
        if(!r) return done(new HttpError(400, 'User does not exists with this id'));

        res.send({
            id: r._id,
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
            birthday: r.birthday
        })
    })
}

/**
* Removes user from the system and unbinds him from all classes
*/
function removeUser(req, res, done) {
    user.removeUser(req.params.userId, null, (e, r) => {
        if(e) return done(new HttpError(500, e));
        if(!r) return done(new HttpError(400, 'User do not exist with id'));

        res.send();
    })
}

module.exports = {
    getAllUsers: getAllUsers,
    getUserById: getUserById,
    createUser: createUser,
    updateUser: updateUser,
    removeUser: removeUser
};
