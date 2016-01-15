var uuid = require('node-uuid');
var user = require('../database/user');
var _ = require('underscore');
var idValidation = require('../util/middleware').idValidation;
var HttpError = require('../util/middleware').HttpError;

/**
* Returns current logged user data
*/
function getLoggedUser(req, res, done) {
    res.send({
        id: req.user.id,
        token: req.user.token,
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        email: req.user.email,
        classes: req.user.classes,
        role: req.user.role,

        gender: req.user.gender,
        country: req.user.country,
        language: req.user.language,
        registered: req.user.registered,
        phone: req.user.phone,             
        birthday: req.user.birthday,         
    })
}

/**
* Returns user info based on the id
*/
function getUserById(req, res, done) {
    var params = {
        userId: req.params.userId
    }

    var v = idValidation( [req.params.userId ]);
    if(!v.valid) return done(new HttpError(400, v.errors))

    user.findUserById(params, (e, r) => {
        if(e) return done(new HttpError(500, e));
        if(!r) return done(new HttpError(400, 'User with this uuid does not exists'));

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
            birthday: r.birthday, 
        })
    })
}

/**
* Returns user info based on the id
*/
function removeUserFromClass(req, res, done) {
    var params = {
        userId: req.params.userId,
        classId: req.params.classId,
    }

    var v = idValidation( [req.params.userId, req.params.classId ]);
    if(!v.valid) return done(new HttpError(400, v.errors))

    user.removeUserFromClass(params, (e, r) => {
        if(e) return done(new HttpError(500, e));
        if(!r) return done(new HttpError(400, 'Can not remove user with this id from class'));

        res.send()
    })
}

/**
 * Returns user image
 */
function getImageForUser(req, res, done) {
    user.findImage(req.params.userId, (e, r) => {
        if(e) return done(new HttpError(500, e));
        if(!r) return done(new HttpError(404));

        res.set('Content-Type', r.image.contentType);
        res.send(r.image.buffer)
    })
}


module.exports = {
    getLoggedUser: getLoggedUser,
    getUserById: getUserById,
    removeUserFromClass: removeUserFromClass,
    getImageForUser: getImageForUser
}
