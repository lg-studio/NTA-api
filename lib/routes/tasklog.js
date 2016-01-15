var Schema = require('../database/models');
var task = require('../database/task');
var user = require('../database/user');
var tasklog = require('../database/tasklog');
var uuid = require('node-uuid');
var async = require('async');
var _ = require('underscore');
var idValidation = require('../util/middleware').idValidation;
var HttpError = require('../util/middleware').HttpError;

var mongoose = require('mongoose');

function getTasklog(req, res, done) {
    tasklog.findTasklogForUser(req.user._id, (e, tasklog) => {
        if(e) return done(new HttpError(500, e));
        if(!tasklog) return done(new HttpError(400, 'User does not have a tasklog'));

        var data = {
            user: tasklog.user,

            tasks: _.map(tasklog.tasks, (e) => {
                return {
                    id: e._id,
                    taskId: e.taskId,
                    done: e.done,
                    rating: e.rating,
                    chatType: e.chatType,
                    chat: _.map(e.chat, (e) => {
                        return {
                            id: e._id,
                            // _type: e._type,
                            text: e.text,
                            answer: e.answer,
                            audioId: e.audioId,
                            audioUploaded: e.audioUploaded,
                            tries: e.tries,
                            result: e.result
                        }
                    })
                }
            })
        }

        res.send(data);
    })
}

/**
* Returns task log for specific user 
*/
function getTasklogForUser(req, res, done) {
    tasklog.findTasklogForUser(req.params.userId, (e, tasklog) => {
        if(e) return done(new HttpError(500, e));
        if(!tasklog) return done(new HttpError(400, 'User does not have a tasklog'));

        var data = {
            user: tasklog.user,

            tasks: _.map(tasklog.tasks, (e) => {
                return {
                    id: e._id,
                    taskId: e.taskId,
                    done: e.done,
                    rating: e.rating,
                    chatType: e.chatType,
                    chat: _.map(e.chat, (e) => {
                        return {
                            id: e._id,
                            // _type: e._type,
                            text: e.text,
                            answer: e.answer,
                            audioId: e.audioId,
                            audioUploaded: e.audioUploaded,
                            tries: e.tries,
                            result: e.result
                        }
                    })
                }
            })
        }

        res.send(data);
    })
}

function logTask(req, res, done) {
    var audioIds = [];

    var model = {
        taskId: req.body.taskId,
        taskName: req.body.taskName,
        chatType: req.body.chatType,
        done: req.body.done || Date.now(),
        rating: req.body.rating,

        chat: _.map(req.body.chat, (e) => {
            // var audio = new Schema.Audio({
            //     uploaded: false
            // });
            // audio.save();
            
            // audioIds.push(audio._id);

            return {
                // _type: e._type,
                text: e.text,
                answer: e.answer,
                audioResponseId: e.audioResponseId,
                // audioId: db.Schema.Types.ObjectId,
                // audioId: mongoose.Types.ObjectId(),
                // audioId: audio._id,
                result: e.result,
                tries: e.tries
            }
        })
    }

    async.series([
        (next) => {
            user.findUserById(req.user._id, (e, r) => {
                if(e) return done(new HttpError(400, 'Error when saving tasklog'));
                if(!r) return done(new HttpError(400, 'User does not exists with this id'));

                next()
            })
        },
        (next) => {
            task.findTaskById(req.body.taskId, (e, r) => {
                if(e) return done(new HttpError(400, 'Error when saving tasklog'));
                if(!r) return done(new HttpError(400, 'Task does not exists with this id'));   

                next()
            })
        },
        (next) => {
            tasklog.addTask(req.user._id, model, (e, r) => {
                if(e) return done(new HttpError(400, 'Error when saving tasklog'));
                if(!r) return done(new HttpError(400, 'User does not exists with this id'));   

                res.send();
            })

            
        }
    ])
}

module.exports = {
    getTasklog: getTasklog,
    getTasklogForUser: getTasklogForUser,
    logTask: logTask,
};
