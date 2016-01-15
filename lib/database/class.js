var Schema = require('./models');
var _ = require('underscore');
var async = require('async');

/**
 * User/tutor
 */

//function findClassById(classId, done) {
//    Schema.Class.findById(classId, done);
//}


function findClassUsers(classId, done) {
    Schema.Class.findOne({
        _id: classId
    }, (e, r) => {
        if(e) return done(e);
        if(!r) return done(null, []);

        Schema.User.find({
            _id: { $in: r.users }
        })
            .select('-image')
            .exec(done)
    })
}

/**
* Finds classes for user
* @params { [classes] }
*/
function findClassesForUser(classes, done) {
    Schema.Class.find({
        _id: {
            $in: classes
        }
    }, done)
}

/**
* Finds class by code and returns basic info
* @params { code }
*/
function findClassByCode(code, done) {
    Schema.Class.findOne({
        code: code
    }, done)
}

/**
* Creates class with code
* @params { userId, name, desc, code }
*/
function createClass(params, done) {
    var _class = new Schema.Class({
        name: params.name,
        desc: params.desc,
        code: params.code,
        courses: params.courses,
        users: params.users,
        currentCourse: params.currentCourse,
        tutor: params.tutor,
        created: params.created
    });

    _class.save( () => {
        Schema.User.update({
            _id: params.tutor
        }, {
            $push: { classes: _class.id }
        })
        .select('_id')
        .exec( (e, r) => { done(e, _class) } )
    });
    //done(null, _class)
}

/**
 * Returns all classes from the system
 * @param done
 */
function findAllClasses(done) {
    Schema.Class.find({}, done)
}

/**
 * Finds class by id
 * @param classId
 * @param done
 */
function findClassById(classId, done) {
    Schema.Class.findById(classId, done)
}

/**
 * Creates class and sets owner to it
 * @param owner
 * @param model
 * @param done
 */
function createClass(model, done) {
    var _class = new Schema.Class(model);

    var todo = [];

    todo.push((next) => {
        (Schema.User.update({
                _id: model.tutor
            }, {
                $push: { classes: _class.id }
            }, next)
        )}
    );

    var users = _.each(model.users, (userId) => {
        todo.push((next) => {
            Schema.User.update({
                _id: userId
            }, {
                $push: {classes: _class.id}
            }, next) });
        });

    _class.save( () => {
        async.parallel(todo, (e, r) => {
            done(e, _class);
        });
    });
}

/**
 * Finds class by id and updates it
 * @param classId
 * @param model
 * @param done
 */
function updateClass(classId, model, done) {
    Schema.Class.findByIdAndUpdate(classId, model, {'new': true}, done )
}

/**
 * Removes class
 * @param owner
 * @param classId
 * @param done
 */
function removeClass(classId, done) {
    async.waterfall([
        (next) => {
            Schema.Class.findOneAndRemove({
                _id: classId,
            }, next);
        },
        (data, next) => {
            if(data) {
                if(data.users && data.users.length > 0) {
                    var tasks = [];

                    _.each(data.users, (e) => {
                        tasks.push( (next) => {
                            Schema.User.update({
                                _id: e
                            }, {
                                $pull: {
                                    classes: data._id
                                }
                            }, next)
                        })
                    });

                    Schema.User.update({
                            _id: model.tutor
                        }, {
                            $pull: { classes: _class.id }
                        }, next);


                    async.parallel(tasks, next)
                } else next(null, data)
            } else next()
        }], done)
}

function createClassByAdmin(model, done) {
    var _class = new Schema.Class(model);

    _class.save( (e, r) => {
        done(e, _class);
        if(model.tutor) {
            Schema.User.update({
                _id: model.tutor
            }, {
                $push: { classes: _class.id }
            })
        }
    });
}

function updateClassByAdmin(classId, model, done) {
    Schema.Class.findByIdAndUpdate(classId, model, { 'new': true }, done )
}

function removeClassByAdmin(classId, done) {
    async.waterfall([
        (next) => {
            Schema.Class.findOneAndRemove({
                _id: classId
            }, next);
        },
        (data, next) => {
            if(data) {
                if(data.users && data.users.length > 0) {
                    var tasks = [];

                    _.each(data.users, (e) => {
                        tasks.push( (next) => {
                            Schema.User.update({
                                _id: e
                            }, {
                                $pull: {
                                    classes: data._id
                                }
                            }, next)
                        })
                    });

                    async.parallel(tasks, next)
                } else next(null, data)
            } else next()
        }], done)
}

/**
* Adds specific user to class
* @params userId
* @params classId
*/
function addUserToClass(userId, classId, done) {
    Schema.Class.findByIdAndUpdate(classId, {
        $push: { users: userId }
    }, { 'new': true }, done )
}

/**
* Adds new message to news array
*/
function addNews(classId, o, done) {
    if(!o.created) o.created = Date.now()
    Schema.Class.update({ _id: classId }, {
        $push: { news: o }
    }, (e, r) => { if(done) done(e, r) })
}

module.exports = {
    findAllClasses: findAllClasses,
    findClassById: findClassById,
    createClass: createClass,
    updateClass: updateClass,
    removeClass: removeClass,


    // admin
    //getAllClasses: getAllClasses,
    createClassByAdmin: createClassByAdmin,
    updateClassByAdmin: updateClassByAdmin,
    removeClassByAdmin: removeClassByAdmin,

    // user/teacher

    findClassByCode: findClassByCode,
    findClassesForUser: findClassesForUser,
    findClassUsers: findClassUsers,
    addUserToClass: addUserToClass,
    addNews: addNews
}
