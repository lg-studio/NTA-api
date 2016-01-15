var idValidation = require('../util/middleware').idValidation;
var HttpError = require('../util/middleware').HttpError;
var scene = require('../database/scene');
var task = require('../database/task');
var location = require('../database/location');
var mediabank = require('../database/mediabank');
var _ = require('underscore');
var async = require('async');
var push = require('../routes/push');

function notEmpty(obj) {
    if(!_.isObject(obj) || !_.isObject(obj.toObject()) ) return false;
    return Object.keys(obj.toObject()).length > 0;
}

function getAllScenes(req, res, done) {
    scene.findAllScenes((e, r) => {
        if(e) return done(new HttpError(500, e));
        if(!r) return done(new HttpError(400, 'Can not find scenes'));

        var r = _.map(r, (e) => {
            return {
                id: e._id,
                name: e.name,
                desc: e.desc,
                tasks: e.tasks,
                created: e.created,
                owner: e.owner,
                location: {
                    name: e.location.name,
                    desc: e.location.desc,
                    lon: e.location.lon,
                    lat: e.location.lat
                }
            }
        });

        res.send(r)
    })
}

function getSceneById(req, res, done) {
    scene.findSceneById(req.params.sceneId, (e, r) => {
        if(e) return done(new HttpError(500, e));
        if(!r) return done(new HttpError(400, 'Can not find scene'));

        var data = {
            id: r._id,
            name: r.name,
            desc: r.desc,
            tasks: r.tasks,
            created: r.created,
            owner: r.owner
        }

        if(r.location) {
            data.location = {
                name: r.location.name,
                desc: r.location.desc,
                lon: r.location.lon,
                lat: r.location.lat
            }
        }

        res.send(data)
    })
}

/**
 * Created new scene and marks it as created by admin
 */
function createScene(req, res, done) {
    var model = {
        name: req.body.name,
        desc: req.body.desc,
        tasks: req.body.tasks,
        created: Date.now(),
        owner: req.owner
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
                    },

                    next()
                })
            } else next()
        },
        (next) => {
            if(req.body.tasks.length > 0) {
                task.findTasksBulk(req.body.tasks, (e, r) => {
                    if(e) return done(new HttpError(500, e));
                    if(!r || r.length == 0) return done(new HttpError(400, 'Tasks do not exist'));

                    next()
                })
            } else next()
        },
        (next) => {
            scene.createScene(null, model, (e, r) => {
                if(e) return done(new HttpError(500, e));
                if(!r) return done(new HttpError(400, 'Can not create scene'));

                var data = {
                    id: r._id,
                    name: r.name,
                    desc: r.desc,
                    tasks: r.tasks,
                    created: r.created,
                    owner: r.owner,
                    location: {
                        name: r.location.name,
                        desc: r.location.desc,
                        lon: r.location.lon,
                        lat: r.location.lat
                    }
                }

                res.send(data);
                next()
            })
        }
    ]);
}

/**
 * Updates scene created by admin
 */
function updateScene(req, res, done) {
    var model = {
        name: req.body.name,
        desc: req.body.desc,
        tasks: req.body.tasks,
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

                    if(r.image) {
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
            if(req.body.tasks.length > 0) {
                task.findTasksBulk(req.body.tasks, (e, r) => {
                    if(e) return done(new HttpError(500, e));
                    if(!r || r.length == 0) return done(new HttpError(400, 'Tasks do not exist'));

                    next()
                })
            } else next()
        },
        (next) => {
            scene.updateScene(req.params.sceneId, req.owner, model, (e, r) => {
                if(e) return done(new HttpError(500, e));
                if(!r) return done(new HttpError(400, 'Scene with this id does not exists or error when updating scene'));

                var data = {
                    id: r._id,
                    name: r.name,
                    desc: r.desc,
                    tasks: r.tasks,
                    created: r.created,
                    owner: r.owner,
                }

                var location = r.toObject().location;
                if(location) {
                    data.location ={
                        name: location.name,
                        desc: location.desc,
                        lon: location.lon,
                        lat: location.lat
                    }
                }


                push.dataChangedPush({
                    type: 'updated',
                    sceneId: req.params.sceneId
                }, (e, r) => { console.log(e, r)})

                res.send(data);
                next()
            })
        }
    ]);
}

/**
 * Removes scene created by admin
 */
function removeScene(req, res, done) {
    scene.removeScene(req.params.sceneId, null, (e, r) => {
        if(e) return done(new HttpError(500, e));
        if(!r) return done(new HttpError(400, 'Scene with this id not exists'));

        push.dataChangedPush({
            type: 'removed',
            sceneId: req.params.sceneId
        }, (e, r) => { console.log(e, r)})

        res.send()
    })
}

module.exports = {
    getAllScenes: getAllScenes,
    getSceneById: getSceneById,
    createScene: createScene,
    updateScene: updateScene,
    removeScene: removeScene
};

