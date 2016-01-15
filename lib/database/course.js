var Schema = require('./models');
var _ = require('underscore');
var async = require('async');

function $(a, b) {
    var message;
    var done;

    if(_.isString(a)) {
        message = a;
        done = b;
    } else done = a;

    return (e, r) => {
        if(e) return done(e);
        if(!r) return done(e);

        done(e, r)
    }
}

function createCourse(params, done) {
    var course = new Schema.Course({
        name: params.name,
        desc: params.desc,
        episodes: []
    });

    course.save( () => {
        var changes = {
            $push: {
                courses: course._id
            }
        }

        if(params.currentCourse) {
            changes.currentCourse = course._id
        }

        Schema.Class.update({
            _id: params.classId
        }, changes, () => {} )
    });
    done(null, course)
}

function findCoursesById(courses, done) {
    Schema.Course.find({
        _id: {
            $in: courses
        }
    }, done)
}



/**
 * Returns all courses in the system
 */
function findAllCourses(done) {
    Schema.Course.find({}, done);
}

/**
 * Finds only one course by id
 * @param courseId
 * @param done
 */
function findCourseById(courseId, done) {
    Schema.Course.findById(courseId, done);
}

/**
 * Creates course and binds it to class if needed
 * @param classId
 * @param model
 * @param done
 */
function createCourse(classId, model, done) {
    var course = new Schema.Course(model);
    course.save( (e, r) => {
        if(classId) {
            Schema.Class.findByIdAndUpdate(classId, {
                $push: {
                    courses: course._id
                }
            }, done )
        } else done(e, r)
    });
}

/**
 * Updates specific course
 * @param courseId
 * @param owner
 * @param model
 * @param done
 */
function updateCourse(courseId, owner, model, done) {
    var find = { _id: courseId };
    if(owner) find.owner = owner;

    Schema.Course.findOneAndUpdate(find, model, {'new': true}, done)
}

/**
 * Removes course and unbinds it from class
 * @param courseId
 * @param owner
 * @param done
 */
function removeCourse(courseId, owner, done) {
    var find = { _id: courseId };
    if(owner) find.owner = owner;

    Schema.Course.findOneAndRemove(find, (e, r) => {
        done(e, r);

        async.parallel([
            (next) => {
                Schema.Class.findOneAndUpdate({
                    courses: courseId
                }, {
                    $pull: { courses: courseId }
                });
                next();
            },
            (next) => {
                Schema.Class.findOneAndUpdate({
                    currentCourse: courseId
                }, {
                    currentCourse: null
                });
                next();
            }
        ]);
    })
}

function createCourseByAdmin(params, done) {
    var course = new Schema.Course(params);
    course.save(done);
}

function updateCourseByAdmin(courseId, params, done) {
    Schema.Course.update({
        _id: courseId,
        admin: true
    }, params, done)
}

// TODO unbind class from this course
function removeCourseByAdmin(courseId, done) {
    Schema.Course.remove({
        _id: courseId,
        admin: true
    }, done)
}

module.exports = {
    // admin
    findAllCourses: findAllCourses,
    findCourseById: findCourseById,
    createCourse: createCourse,
    updateCourse: updateCourse,
    removeCourse: removeCourse,


    createCourseByAdmin: createCourseByAdmin,
    updateCourseByAdmin: updateCourseByAdmin,
    removeCourseByAdmin: removeCourseByAdmin,

    // user/teacher
    findCoursesById: findCoursesById,

}
