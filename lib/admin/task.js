var idValidation = require('../util/middleware').idValidation;
var HttpError = require('../util/middleware').HttpError;
var task = require('../database/task');
var _ = require('underscore');
var mediabank = require('../database/mediabank');
var character = require('../database/character');
var location = require('../database/location');
var async = require('async');
var push = require('../routes/push');

function isEmpty(obj) {
    return Object.keys(obj.toObject()).length === 0;
}

function notEmpty(obj) {
    if(!obj || !obj.toObject()) return false;
    return Object.keys(obj.toObject()).length > 0;
}

/**
* Returns all scenes
*/
function getAllTasks(req, res, done) {
    task.findAllTasks((e, r) => {
        if(e) return done(new HttpError(500, e));
        if(!r) return done(new HttpError(400, 'Can not find tasks'));

        r = _.map(r, (e) => {
            return {
                id: e._id,
                name: e.name,
                desc: e.desc,
                shortInfo: e.shortInfo,
                state: e.state,
                owner: e.owner,
                chatType: e.chatType,
                character: {
                    id: e.character._id,
                    name: e.character.name,
                    desc: e.character.desc,
                    image: e.character.image
                },
                location: {
                    id: e.location._id,
                    name: e.location.name,
                    desc: e.location.desc,
                    lon: e.location.lon,
                    lat: e.location.lat,
                    image: e.location.image
                },
                dueDate: e.dueDate,
                chat: _.map(e.chat, (e) => {
                    return {
                        //id: e._id,
                        _type: e._type,
                        text: e.text,
                        audioId: e.audioId,
                        answers: e.answers
                    }
                })
            }
        });

        res.send(r)
    })
}

/**
 * Returns only one task with specific id
 */
function getTaskById(req, res, done) {
    task.findTaskById(req.params.taskId, (e, r) => {
        if(e) return done(new HttpError(500, e));
        if(!r) return done(new HttpError(400, 'Can not find task with this ID'));

        res.send({
            id: r._id,
            name: r.name,
            desc: r.desc,
            state: r.state,
            shortInfo: r.shortInfo,
            owner: r.owner,
            chatType: r.chatType,
            character: {
                id: r.character._id,
                name: r.character.name,
                desc: r.character.desc,
                // image: r.character.image
            },
            location: {
                id: r.location._id,
                name: r.location.name,
                desc: r.location.desc,
                lon: r.location.lon,
                lat: r.location.lat,
                // image: r.location.image
            },
            dueDate: r.dueDate,
            chat: _.map(r.chat, (e) => {
                return {
                    //id: e._id,
                    _type: e._type,
                    text: e.text,
                    audioId: e.audioId,
                    answers: e.answers
                }
            })
        })
    })
}

/**
* Creates new task
*/
function createTask(req, res, done) {
    var model = {
        name: req.body.name,
        desc: req.body.desc,
        shortInfo: req.body.shortInfo,
        state: req.body.state,
        chat: req.body.chat,
        dueDate: req.body.dueDate,
        created: Date.now(),

        owner: req.owner,
        chatType: req.body.chatType,
    };

    async.series([
        (next) => {
            if(req.body.location) {
                location.findLocationById(req.body.location, (e, r) => {
                    if(e) return done(new HttpError(500, e));
                    if(!r) return done(new HttpError(400, 'Location does not exists'));

                    model.location = {
                        name: r.name,
                        desc: r.desc,
                        lon: r.lon,
                        lat: r.lat,
                    }

                    if(notEmpty(r.image)) {
                        model.location.image = {
                            filename: r.image.filename,
                            contentType: r.image.contentType,
                            length: r.image.length,
                            buffer: r.image.buffer,
                            created: r.image.created
                        }
                    }

                    next()
                })
            } else next()
        },
        (next) => {
            if(req.body.character) {
                character.findCharacterById(req.body.character, (e, r) => {
                    if(e) return done(new HttpError(500, e));
                    if(!r) return done(new HttpError(400, 'Character does not exists'));

                    model.character = {
                        name: r.name,
                        desc: r.desc,
                    }

                    if(notEmpty(r.image)) {
                        model.character.image = {
                            filename: r.image.filename,
                            contentType: r.image.contentType,
                            length: r.image.length,
                            buffer: r.image.buffer,
                            created: r.image.created
                        }
                    }

                    next()
                })
            } else next()
        },
        (next) => {
            if(req.body.image) {
                mediabank.getMediabankContent(req.body.image, (e, r) => {
                    if(e) return done(new HttpError(500, e));
                    if(!r) return done(new HttpError(400, 'Content does not exists'));

                    model.image = {
                        filename: r.filename,
                        contentType: r.contentType,
                        length: r.length,
                        buffer: r.buffer,
                        created: r.created
                    },

                    next()
                })
            } else next()
        },
        (next) => {
            task.createTask(null, model, (e, r) => {
                if(e) return done(new HttpError(500, e));
                if(!r) return done(new HttpError(400, 'Can not create task'));

                var data = {
                    id: r._id,
                    name: r.name,
                    desc: r.desc,
                    chat: r.chat,
                    created: r.created,
                    shortInfo: r.shortInfo,
                    owner: r.owner,
                    chatType: r.chatType,
                    location: {
                        name: r.location.name,
                        desc: r.location.desc,
                        lon: r.location.lon,
                        lat: r.location.lat
                    },
                    character: {
                        name: r.character.name,
                        desc: r.character.desc,
                    }
                }

                res.send(data);
                next()
            })
        }
    ]);
}

/**
* Updates task data
*/
function updateTask(req, res, done) {
    var model = {
        name: req.body.name,
        desc: req.body.desc,
        shortInfo: req.body.shortInfo,
        state: req.body.state,
        chat: req.body.chat,
        dueDate: req.body.dueDate || 0,
        chatType: req.body.chatType
    };

    async.series([
        (next) => {
            if(req.body.location) {
                location.findLocationById(req.body.location, (e, r) => {
                    if(e) return done(new HttpError(500, e));
                    if(!r) return done(new HttpError(400, 'Location does not exists'));

                    model.location = {
                        name: r.name,
                        desc: r.desc,
                    }

                    if(notEmpty(r.image)) {
                        model.location.image = {
                            filename: r.image.filename,
                            contentType: r.image.contentType,
                            length: r.image.length,
                            buffer: r.image.buffer
                        }
                    }

                    next()
                })
            } else next()
        },
        (next) => {
            if(req.body.character) {
                character.findCharacterById(req.body.character, (e, r) => {
                    if(e) return done(new HttpError(500, e));
                    if(!r) return done(new HttpError(400, 'Character does not exists'));

                    model.character = {
                        name: r.name,
                        desc: r.desc,
                    }

                    if(notEmpty(r.image)) {
                        model.character.image = {
                            filename: r.image.filename,
                            contentType: r.image.contentType,
                            length: r.image.length,
                            buffer: r.image.buffer,
                        }
                    }

                    next()
                })
            } else next()
        },
        (next) => {
            if(req.body.image) {
                mediabank.getMediabankContent(req.body.image, (e, r) => {
                    if(e) return done(new HttpError(500, e));
                    if(!r) return done(new HttpError(400, 'Content does not exists'));

                    model.image = {
                        filename: r.filename,
                        contentType: r.contentType,
                        length: r.length,
                        buffer: r.buffer,
                        created: r.created
                    },

                    next()
                })
            } else next()
        },
        (next) => {
            task.updateTask(req.params.taskId, null, model, (e, r) => {
                if(e) return done(new HttpError(500, e));
                if(!r) return done(new HttpError(400, 'Task with this id does not exist'));

                var data = {
                    id: r._id,
                    name: r.name,
                    desc: r.desc,
                    chat: r.chat,
                    created: r.created,
                    shortInfo: r.shortInfo,
                    owner: r.owner,
                    chatType: r.chatType,
                    location: {
                        name: r.location.name,
                        desc: r.location.desc,
                        lon: r.location.lon,
                        lat: r.location.lat
                    },
                    character: {
                        name: r.character.name,
                        desc: r.character.desc,
                    }
                }

                // send push
                push.dataChangedPush({
                    type: 'updated',
                    taskId: req.params.taskId
                }, (e, r) => { console.log(e, r)})

                res.send(data);
                next()
            })
        }
    ]);
}

/**
* Removes task
*/
function removeTask(req, res, done) {
    task.removeTask(req.params.taskId, null, (e, r) => {
        if(e) return done(new HttpError(500, e));
        if(!r) return done(new HttpError(400, 'Task with this id not exists'));

        push.dataChangedPush({
            type: 'removed',
            taskId: req.params.taskId
        }, (e, r) => { console.log(e, r)})

        res.send()
    })
}

module.exports = {
    getAllTasks: getAllTasks,
    getTaskById: getTaskById,
    createTask: createTask,
    updateTask: updateTask,
    removeTask: removeTask
};
