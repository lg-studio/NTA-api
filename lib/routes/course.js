var course = require('../database/course')
var _class = require('../database/class')
var uuid = require('node-uuid')
var _ = require('underscore')
var async = require('async')
var idValidation = require('../util/middleware').idValidation;
var HttpError = require('../util/middleware').HttpError;
var push = require('./push');

/**
* Get course based on logged user
*/
function getCourses(req, res, done) {
    var params = {
        classId: req.params.classId,
        id: req.user._id
    }

    var courses = [];

    async.series([
        (next) => {
            _class.findClassById(req.params.classId, (e, r) => {
                if(e) return done(new HttpError(500, e));
                if(!r) return done(new HttpError(400, 'Class with this uuid does not exists'));

                params = {
                    courses: r.courses
                }

                courses = r.courses;
                next()
            })
        },
        (next) => {
            course.findCoursesById(courses, (e, r) => {
                if(e) return done(new HttpError(500, e));
                if(!r) return done(new HttpError(400, 'Course with this uuid don\'t not exists'));

                var r = _.map(r, (e) => {
                    return {
                        id: e.id,
                        name: e.name,
                        desc: e.desc,
                        episodes: e.episodes
                    }
                })

                res.send(r)
                next()
            })
        }
    ])
}

/**
* Get one course by course_id
*/
function getCourseById(req, res, done) {
    async.series([
        (next) => {
            if(req.params.classId) {
                _class.findClassById(req.params.classId, (e, r) => {
                    if(e) return done(new HttpError(500, e));
                    if(!r) return done(new HttpError(400, 'Class with this uuid does not exists'));
                    next()
                })
            }
        },
        (next) => {
            course.findCourseById(req.params.courseId, (e, r) => {
                if(e) return done(new HttpError(500, e));
                if(!r) return done(new HttpError(400, 'Course with this uuid does not exists'));

                res.send({
                    id: r.id,
                    name: r.name,
                    desc: r.desc,
                    episodes: r.episodes
                });
                next()
            })
        }
    ])
}

/**
* Creates course
*/
function createCourse(req, res, done) {
    var params = {
        classId: req.params.classId,
        desc: req.body.desc,
        name: req.body.name,
        currentCourse: req.body.current || false,
    }

    async.series([
        (next) => {
            _class.findClassById(req.params.classId, (e, r) => {
                if(e) return done(new HttpError(500, e));
                if(!r) return done(new HttpError(400, 'Class with this uuid does not exists'));
                next()
            })
        },
        (next) => {
            course.createCourse(params, (e, r) => {
                if(e) return done(new HttpError(500, e));
                if(!r) return done(new HttpError(400, 'Error creating new course'));

                push.dataChangedPush({
                    type: 'created',
                    classId: req.params.classId,
                    courseId: r._id
                }, (e, r) => { console.log(e, r)})

                res.send({
                    id: r._id,
                    name: r.name,
                    desc: r.desc,
                    episodes: r.episodes
                })
                next()
            })
        }
    ])
}

module.exports = {
    getCourses: getCourses,
    getCourseById: getCourseById,
    createCourse: createCourse,
    getCourseById: getCourseById
}
