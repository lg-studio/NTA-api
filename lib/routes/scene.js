var scene = require('../database/scene');
var uuid = require('node-uuid');
var _ = require('underscore');
var idValidation = require('../util/middleware').idValidation;
var HttpError = require('../util/middleware').HttpError;
var Uploader = require('../util/uploader');
var Mediabank = require('../database/mediabank');
var push = require('./push')

/**
* Returns one scene
*/
function getScene(req, res, done) {
    scene.findSceneById(req.params.sceneId, (e, r) => {
        if(e) return done(new HttpError(500, e));
        if(!r) return done(new HttpError(400, 'Scene with this id does not exists'));

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
* Returns all episodes in the course scope
*/
function getScenes(req, res, done) {
    var o = {
        episodeId: req.params.episodeId
    };

    scene.findScenesByEpisodeId(o, (e, r) => {
        if(e) return done(new HttpError(500, e));

        var data = _.map(r, (e) => {
            return {
                image: e.image,
                id: e._id,
                name: e.name,
                desc: e.desc,
                tasks: e.tasks
            }
        });

        res.send(data)
    })
}

/**
* Creates course
*/
function createScene(req, res) {
    var o = {
        episodeId: req.params.episodeId,
        name: req.body.name,
        desc: req.body.desc,
        tasks: req.body.tasks,
        image: req.body.image,
        created: Date.now()
    };

    if(o.image == '' || _.isEmpty(o.image)) delete o.image;

    scene.createScene(o, (e, r) => {
        if(e) return done(new HttpError(500, e));
        if(!r) return done(new HttpError(400, 'Error when creating scene'));

        push.dataChangedPush({
            type: 'created',
            episodeId: req.params.episodeId,
            sceneId: r._id
        }, (e, r) => { console.log(e, r)})

        res.send({
            id: r._id,
            // image: r.image,
            created: r.created,
            name: r.name,
            desc: r.desc,
            tasks: r.tasks
        })
    })
}

/**
* Returns scene based on uuid in the course scope
*/
function getSceneById(req, res, done) {
    var o = {
        episodeId: req.params.episodeId,
        sceneId: req.params.sceneId
    };

    scene.findSceneById(req.params.sceneId, (e, r) => {
        if(e) return done(new HttpError(500, e));
        if(!r) return done(new HttpError(400, 'Scene with this id does not exists'));

        res.send({
            // image: r.image,
            id: r._id,
            name: r.name,
            desc: r.desc,
            tasks: r.tasks
        })
    })
}

function attachImageToScene(req, res, done) {
    var o = {
        sceneId: req.params.sceneId
    };

    // upload image to mediabank
    Uploader(req, (e, r) => {
        if(e || r.files.length == 0 )
            return done(new HttpError(400,  'Image is not present'));

        var image = r.files[0];

        if(image.buffer.length !== image.length || image.buffer.length == 0)
            return done(new HttpError(400, 'Image is corrupted or it\'s length is 0'));

        var o = {
            name: image.name,
            filename: image.filename,
            contentType: image.contentType,
            length: image.length,
            buffer: image.buffer
        };

        Mediabank.createMediabankItem(o, (e, r) => {
            //o.buffer = [];

            var o = {
                sceneId: req.params.sceneId,
                imageId: r._id
            }

            scene.attachImageToScene(o, (e, r) => {
                if(e) return done(new HttpError(500, e));
                if(!r) return done(new HttpError(400, 'Scene with this id does not exists'));

                res.send({
                    // image: r.image,
                    id: r._id,
                    name: r.name,
                    desc: r.desc,
                    tasks: r.tasks
                });
            })
        } );
    })
}

/**
* Returns image for specific scene
*/
function getImageForScene(req, res, done) {
    scene.findImage(req.params.sceneId, (e, r) => {
        if(e) return done(new HttpError(500, e));
        if(!r) return done(new HttpError(404));

        res.set('Content-Type', r.image.contentType);
        res.send(r.image.buffer)
    })
}

module.exports = {
    getScene: getScene,
    getScenes: getScenes,
    getSceneById: getSceneById,
    createScene: createScene,
    attachImageToScene: attachImageToScene,

    getImageForScene: getImageForScene
};

