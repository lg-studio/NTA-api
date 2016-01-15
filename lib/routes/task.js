var task = require('../database/task');
var scene = require('../database/scene');
var uuid = require('node-uuid');
var _ = require('underscore');
var idValidation = require('../util/middleware').idValidation;
var HttpError = require('../util/middleware').HttpError;
var Schema = require('../database/models');
var push = require('./push');

/**
* Returns one task
*/
function getTask(req, res, done) {
    task.findTaskById(req.params.taskId, (e, r) => {
        if(e) return done(new HttpError(500, e));
        if(!r) return done(new HttpError(400, 'Task with this id does not exists'));

        res.send({
           id: r._id,
            name: r.name,
            desc: r.desc,
            shortInfo: r.shortInfo,
            state: r.state,
            owner: r.owner,
            chatType: r.chatType,
            character: {
                // id: r.character._id,
                name: r.character.name,
                desc: r.character.desc,
                // image: r.character.image
            },
            location: {
                // id: r.location._id,
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
* Returns all tasks in the course scope
*/
function getTasks(req, res, done) {
    task.findTasksBySceneId(req.params.sceneId, (e, r) => {
        if(e) return done(new HttpError(500, e));

        r = _.map(r, (e) => {
            return {
                id: e._id,
                name: e.name,
                desc: e.desc,
                shortInfo: e.shortInfo,
                chatType: e.chatType,
                character: {
                    name: e.character.name,
                    desc: e.character.desc,
                },
                location: {
                    name: e.location.name,
                    desc: e.location.desc,
                    lon: e.location.lon,
                    lat: e.location.lat,
                },
                dueDate: e.dueDate,
                chat: _.map(e.chat, (e) => {
                    return {
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
* Creates task
*/
function createTask(req, res, done) {
    var params = {
        sceneId: req.params.sceneId,
        name: req.body.name,
        desc: req.body.desc,
        locationId: req.body.location || false,
        characterId: req.body.character || false,
        dueDate: req.body.dueDate || false,

        shortInfo: req.body.shortInfo,
        chatType: req.body.chatType
    };

    task.createTask(params, (e, r) => {
        if(e) return done(new HttpError(500, e));
        if(!r) return done(new HttpError(400, 'Error when creating task'));

        push.dataChangedPush({
            type: 'created',
            sceneId: req.params.sceneId,
            taskId: r._id
        }, (e, r) => { console.log(e, r)})

        res.send({
            id: r._id,
            name: r.name,
            desc: r.desc,
            character: r.character,
            location: r.location,
            dueDate: r.dueDate,
            shortInfo: r.shortInfo,
            chatType: r.chatType,
        })
    })
}

/**
* Returns task based on uuid in the scene scope
*/
function getTaskById(req, res, done) {
    task.findTaskById(req.params.taskId, (e, r) => {
        if(e) return done(new HttpError(500, e));
        if(!r) return done(new HttpError(400, 'Task with this id does not exists'));

        res.send({
            id: r._id,
            name: r.name,
            desc: r.desc,
            shortInfo: r.shortInfo,
            chatType: r.chatType,
            character: {
                name: r.character.name,
                desc: r.character.desc,
                image: r.character.image
            },
            location: {
                name: r.location.name,
                desc: r.location.desc,
                lon: r.location.lon,
                lat: r.location.lat,
                image: r.location.image
            },
            dueDate: r.dueDate,
            chat: _.map(r.chat, (e) => {
                return {
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
* Returns task with binded response audio ids
*/
function getTaskByIdForUser(req, res, done) {
    task.findTaskById(req.params.taskId, (e, r) => {
        if(e) return done(new HttpError(500, e));
        if(!r) return done(new HttpError(400, 'Task with this id does not exists'));

        res.send({
            id: r._id,
            name: r.name,
            desc: r.desc,
            shortInfo: r.shortInfo,
            chatType: r.chatType,
            character: {
                name: r.character.name,
                desc: r.character.desc,
                image: r.character.image
            },
            location: {
                name: r.location.name,
                desc: r.location.desc,
                lon: r.location.lon,
                lat: r.location.lat,
                image: r.location.image
            },
            dueDate: r.dueDate,
            chat: _.map(r.chat, (e) => {
                // create audio bindings for specific user
                var audio = new Schema.Audio({
                    uploaded: false
                });
                audio.save();

                return {
                    _type: e._type,
                    text: e.text,
                    audioId: e.audioId,
                    answers: e.answers,
                    audioResponseId: audio._id
                }
            })
        })
    })
}

function getTasksForUser(req, res, done) {
    task.findTasksBySceneId(req.params.sceneId, (e, r) => {
        if(e) return done(new HttpError(500, e));
        if(!r) return done(new HttpError(400, 'Scene with this id does not exists'));
        
        var data = _.map(r, (e) => {
            var r = {
                id: e._id,
                name: e.name,
                desc: e.desc,
                shortInfo: e.shortInfo,
                chatType: e.chatType,
                dueDate: e.dueDate,
                chat: _.map(e.chat, (e) => {
                    var audio = new Schema.Audio({
                        uploaded: false
                    });
                    audio.save();

                    return {
                        _type: e._type,
                        text: e.text,
                        audioId: e.audioId,
                        answers: e.answers,
                        audioResponseId: audio._id
                    }
                })
            }

            if(e.character) {
                r.character = {
                    name: e.character.name,
                    desc: e.character.desc
                }
            }

            if(e.location) {
                r.location = {
                    name: e.location.name,
                    desc: e.location.desc,
                    lon: e.location.lon,
                    lat: e.location.lat
                }
            }

            return r;
        });

        res.send(data)
    });
}

function getImageForTask(req, res, done) {
    task.findImage(req.params.taskId, (e, r) => {
        if(e) return done(new HttpError(500, e));
        if(!r) return done(new HttpError(404));

        res.set('Content-Type', r.image.contentType);
        res.send(r.image.buffer)
    })
}

module.exports = {
    getTask: getTask,
    getTasks: getTasks,
    getTaskById: getTaskById,
    getTaskByIdForUser: getTaskByIdForUser,
    getTasksForUser: getTasksForUser,
    createTask: createTask,

    getImageForTask: getImageForTask
};
