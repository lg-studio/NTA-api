var course = require('../database/course');
var idValidation = require('../util/middleware').idValidation;
var HttpError = require('../util/middleware').HttpError;
var _ = require('underscore');
var async = require('async');
var push = require('../routes/push');
var _class = require('../database/class');

function getAllCourses(req, res, done) {
    course.findAllCourses((e, r) => {
        if(e) return done(new HttpError(500, e));
        if(!r) return done(new HttpError(400, 'Can not find courses'));

        var r = _.map(r, (e) => {
            return {
                id: e._id,
                name: e.name,
                desc: e.desc,
                episodes: e.episodes,
                created: e.created,
                owner: e.owner
            }
        });
        res.send(r)
    })
}

function getCourseById(req, res, done) {
    course.findCourseById(req.params.courseId, (e, r) => {
        if(e) return done(new HttpError(500, e));
        if(!r) return done(new HttpError(400, 'Course with this id does not exist'));

        res.send({
            id: r._id,
            name: r.name,
            desc: r.desc,
            episodes: r.episodes,
            owner: r.owner,
            created: r.created,
        })
    })
}

function createCourse(req, res, done) {
    var model = {
        desc: req.body.desc,
        name: req.body.name,
        episodes: _.uniq(req.body.episodes),

        owner: req.owner,
        created: Date.now()
    }

    course.createCourse(null, model, (e, r) => {
        if(e)return done(new HttpError(500, e));
        if(!r) return done(new HttpError(400, 'Error creating new course'));

        res.send({
            id: r._id,
            name: r.name,
            desc: r.desc,
            created: r.created,
            episodes: r.episodes,
            owner: r.owner
        })
    })
}

function updateCourse(req, res, done) {
    var model = {
        desc: req.body.desc,
        name: req.body.name,
        episodes: _.uniq(req.body.episodes),
    }

    course.updateCourse(req.params.courseId, null, model, (e, r) => {
        if(e) return done(new HttpError(500, e));
        if(!r) return done(new HttpError(400, 'Can not update course with this id from class'));

        push.dataChangedPush({
            type: 'updated',
            courseId: req.params.courseId
        }, (e, r) => { console.log(e, r)})

        res.send({
            id: r._id,
            name: r.name,
            desc: r.desc,
            episodes: r.episodes,
            created: r.created,
            owner: r.owner
        })
    })
}

function removeCourse(req, res, done) {
    course.removeCourse(req.params.courseId, null, (e, r) => {
        if(e) return done(new HttpError(500, e));
        if(!r) return done(new HttpError(400, 'Course with this id not exists'));

        push.dataChangedPush({
            type: 'removed',
            courseId: req.params.courseId
        }, (e, r) => { console.log(e, r)})

        res.send()
    })
}

module.exports = {
    getAllCourses: getAllCourses,
    getCourseById: getCourseById,
    createCourse: createCourse,
    updateCourse: updateCourse,
    removeCourse: removeCourse
};
