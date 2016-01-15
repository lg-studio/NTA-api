var uuid = require('node-uuid');
var _ = require('underscore');
var idValidation = require('../util/middleware').idValidation;
var HttpError = require('../util/middleware').HttpError;
var Schema = require('../database/models');
var Uploader = require('../util/uploader');
var async = require('async');

var Character = require('../database/character');
var Location = require('../database/location');
var Episode = require('../database/episode');
var Scene = require('../database/scene');
var Task = require('../database/task');
var User = require('../database/user');

function getMediabank(req, res, done) {
    Schema.Mediabank.find()
        .select('_id contentType filename')
        .exec((e, r) => {
            if(e) return done(new HttpError(400, 'Error when reading media'));

            var data = _.map(r, (e) => {
                return {
                    id: e._id,
                    filename: e.filename,
                    contentType: e.contentType
                }
            });

            res.send(data);
        })
}

function getMediabankItem(req, res, done) {
    var params = {
        mediaId: req.params.mediaId
    };

    Schema.Mediabank.findById(params.mediaId)
        .exec( (e, r) => {
            if(e) return done(new HttpError(400, 'Error when reading media'));
            if(!r) return done(new HttpError(404));

            res.set('Content-Type', r.contentType);
            res.send(r.buffer);
        })
}

// bind specific image to
var bind = {
    userId: (id, mediaItem, done) => {
        User.attachImage(id, mediaItem, done);
    },
    episodeId: (id, mediaItem, done) => {
        Episode.attachImage(id, mediaItem, done);
    },
    sceneId: (id, mediaItem, done) => {
        Scene.attachImage(id, mediaItem, done);
    },
    taskId: (id, mediaItem, done) => {
        Task.attachImage(id, mediaItem, done);
    },
    locationId: (id, mediaItem, done) => {
        Location.attachImage(id, mediaItem, done);
    },
    characterId: (id, mediaItem, done) => {
        Character.attachImage(id, mediaItem, done)
    }
}

function createMediabankItem(req, res, done) {
    Uploader(req, (e, fields, files) => {
        if(e || files.length == 0 )
            return done(new HttpError(400, 'Media is not present'));

        var media = files[0];

        if(media.buffer.length !== media.length || media.buffer.length == 0)
            return done(new HttpError(400, 'Media is corrupted or it\'s length is 0'));

        var mediaItem = new Schema.Mediabank({
            name: media.name,
            filename: media.filename,
            contentType: media.contentType,
            length: media.length,
            buffer: media.buffer,
            created: Date.now()
        });

        // validate binder property and value
        var first;
        if(!_.isEmpty(fields)) {
            first = Object.keys(fields)[0];
            if(!first) return done(new HttpError(400, 'Bind field should not be empty'));

            // copy this image to specific item
            var execBinder = bind[first];
            if(!execBinder) return done(new HttpError(400, 'Bind field should exist'));
        }

        
        async.waterfall([
            (next) => {
                if(execBinder) {
                    execBinder(fields[first], mediaItem, (e, r) => {
                        if(e) return done(new HttpError(400, 'Error when attaching image to item'));
                        if(!r) return done(new HttpError(400, 'Item with id ' + fields[first] + ' does not exist'));
                        next()
                    });
                } else next()
            },
            (next) => {
                mediaItem.save((e, r) => {
                    if(e) return done(new HttpError(400, 'Error when saving media to mediabank'));
                    if(!r) return done(new HttpError(400, 'Item can not be saved to mediabank'));

                    res.send({
                        id: mediaItem._id,
                        filename: mediaItem.filename,
                        contentType: mediaItem.contentType
                    });
                    media.buffer = [];
                    next();
                });
            }
        ]);

    })
}

function updateMediabankItem(req, res, done) {
    Uploader(req, (e, r) => {
        if(e || r.files.length == 0 )
            return done(new HttpError(400, 'Media is not present'));

        var media = r.files[0];

        if(media.buffer.length !== media.length || media.buffer.length == 0)
            return done(new HttpError(400, 'Media is corrupted or it\'s length is 0'));

        var v = idValidation( [req.params.mediaId ]);
        if(!v.valid) return done(new HttpError(400, v.errors));

        var mediaItem = new Schema.Mediabank({
            name: media.name,
            filename: media.filename,
            contentType: media.contentType,
            length: media.length,
            buffer: media.buffer
        });

        mediaItem.findByIdAndUpdate(req.params.mediaId, {
            name: media.name,
            filename: media.filename,
            contentType: media.contentType,
            length: media.length,
            buffer: media.buffer
        }, (e, r) => {
            if(e || !r) return done(new HttpError(400, 'Error when saving media'));

            res.send();
            media.buffer = [];
        });

    })
}

function removeMediabankItem(req, res, done) {
    Schema.Mediabank.remove({ _id: req.params.mediaId }, (e, r) => {
            if(e) return done(new HttpError(400, 'Error when reading media'));
            if(!r.result.n) return done(new HttpError(404));

            res.send();
        })
}

module.exports = {
    getMediabank: getMediabank,
    getMediabankItem: getMediabankItem,
    createMediabankItem: createMediabankItem,
    updateMediabankItem: updateMediabankItem,
    removeMediabankItem: removeMediabankItem
};
