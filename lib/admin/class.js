var _class = require('../database/class');
var HttpError = require('../util/middleware').HttpError;
var _ = require('underscore');
var async = require('async');

function generateClassCode()
{
    return Math.random().toString(10).substr(2, 8)
}

function getAllClasses(req, res, done) {
    _class.findAllClasses((e, r) => {
        if(e) return done(new HttpError(500, e));
        if(!r) return done(new HttpError(400,  'Some error when retrieving classes'));

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
        if(!r) return done(new HttpError(400,  'Class with this ID does not exist'));

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

function createClass(req, res, done) {
    var model = {
        name: req.body.name,
        desc: req.body.desc,
        code: generateClassCode(),
        courses: _.uniq(req.body.courses),
        users: _.uniq(req.body.users),
        currentCourse: req.body.currentCourse,
        tutor: req.body.tutor,
        created: Date.now()
    }

    _class.createClass(model, (e, r) => {
        if(e) return res.status(500, e).send();
        if(!r) return done(new HttpError(400, 'Error creating class'));

        // add to news
        _class.addNews(r._id, { 
            _type: 'created',
            object: r._id,
            author: req.user._id
        });

        res.send({
            id: r._id,
            name: r.name,
            desc: r.desc,
            code: r.code,
            courses: r.courses,
            users: r.users,
            currentCourse: r.currentCourse,
            tutor: r.tutor,
            created: r.created
        })
    })
}

/**
* Updates class data in the system
*/
function updateClass(req, res, done) {
    var params = {
        name: req.body.name,
        desc: req.body.desc,
        courses: _.uniq(req.body.courses),
        users: _.uniq(req.body.users),
        currentCourse: req.body.currentCourse,
        tutor: req.body.tutor
    }

    _class.updateClassByAdmin(req.params.classId, params, (e, r) => {
        if(e) return done(new HttpError(500, e));
        if(!r) return done(new HttpError(400, 'Error updating class'));

        // add to news
        _class.addNews(r._id, { 
            _type: 'updated',
            object: r._id,
            author: req.user._id
        });

        res.send({
            id: r._id,
            name: r.name,
            desc: r.desc,
            code: r.code,
            courses: r.courses,
            users: r.users,
            currentCourse: r.currentCourse,
            tutor: r.tutor,
            created: r.created
        })
    })
}

/**
* Removes class from the system and unbinds him from all classes
*/
function removeClass(req, res, done) {
    _class.removeClassByAdmin(req.params.classId, (e, r) => {
        if(e) return done(new HttpError(500, e));
        if(!r) return done(new HttpError(400, 'Can\'t remove class with this id from class'));

        // add to news
        _class.addNews(r._id, { 
            _type: 'removed',
            object: r._id,
            author: req.user._id
        });

        res.send()
    })
}

module.exports = {
    getAllClasses: getAllClasses,
    getClassById: getClassById,
    createClass: createClass,
    updateClass: updateClass,
    removeClass: removeClass
};
