var _ = require('underscore');
var async = require('async');
var _class = require('../database/class');
var uuid = require('node-uuid');
var idValidation = require('../util/middleware').idValidation;
var HttpError = require('../util/middleware').HttpError;

function generateClassCode()
{
    return Math.random().toString(10).substr(2, 8)
}

/**
 * Returns classes info for current user
 * @param req
 * @param res
 * @param done
 */
function getClasses(req, res, done) {
    _class.findClassesForUser(req.user.classes, (e, r) => {
        if(e) return done(new HttpError(500, e));
        if(!r) return done(new HttpError(400, 'Some error when querying classes'));

        var r = _.map(r, (e) => {
            return {
                id: e._id,
                name: e.name,
                desc: e.desc,
                courses: e.courses,
                users: e.users,
                code: e.code,
                currentCourse: e.currentCourse,
                tutor: e.tutor,
                created: e.created
            }
        });
        res.send(r)
    })
}

function getClassById(req, res, done) {
    _class.findClassById(req.params.classId, (e, r) => {
        if(e) return done(new HttpError(500, e));
        if(!r) return done(new HttpError(400, 'Class with this is does not exists'));

        res.send({
            id: r._id,
            name: r.name,
            desc: r.desc,
            courses: r.courses,
            users: r.users,
            code: r.code,
            currentCourse: r.currentCourse,
            tutor: r.tutor,
            created: r.created
        })
    })
}

function getClassUsers(req, res, done) {
    _class.findClassUsers(req.params.classId, (e, r) => {
        if(e) return done(new HttpError(500, e));
        if(!r) return res.send(r);

        var data = _.map(r, (e) => {
            return {
                id: e._id,
                first_name: e.first_name,
                last_name: e.last_name,
                image: e.image,
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
        res.send(data)
    })
}

// TODO check later
function updateClass(req, res, done) {
    var params = {
        name: req.body.name,
        desc: req.body.desc,
        code: generateClassCode(),
        currentCourse: req.body.currentCourse,
        courses: req.body.courses,
        tutor: req.body.tutor,
        users: req.body.users
    }

    _class.updateClassByAdmin(params, (e, r) => {
        if(e) return done(new HttpError(500, e));
        if(!r || r.length == 0) return done(new HttpError(400, "Error updating class"));

        res.send({
            id: r._id,
            name: r.name,
            desc: r.desc,
            courses: r.courses,
            users: r.users,
            code: r.code,
            currentCourse: r.currentCourse
        })
    })
}

// TODO check later
function createClass(req, res, done) {
    var params = {
        name: req.body.name,
        desc: req.body.desc,
        code: generateClassCode(),
        currentCourse: req.body.currentCourse,
        courses: req.body.courses,
        tutor: req.body.tutor,
        users: req.body.users
    }

    _class.createClassByAdmin(params, (e, r) => {
        if(e) return done(new HttpError(500, e));
        if(!r) return done(new HttpError(400, "Error creating class"));

        res.send({
            id: r._id,
            name: r.name,
            desc: r.desc,
            code: r.code,
            courses: r.courses,
            users: r.users,
            currentCourse: r.currentCourse
        })
    })
}

module.exports = {
    getClasses: getClasses,
    getClassById: getClassById,
    getClassUsers: getClassUsers,

    createClass: createClass
}
