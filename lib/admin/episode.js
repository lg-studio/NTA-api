var idValidation = require('../util/middleware').idValidation;
var HttpError = require('../util/middleware').HttpError;
var episode = require('../database/episode');
var _ = require('underscore');
var async = require('async');
var mediabank = require('../database/mediabank');
var push = require('../routes/push');

function getAllEpisodes(req, res, done) {
    episode.findAllEpisodes( (e, r) => {
        if(e) return done(new HttpError(500, e));
        if(!r) return done(new HttpError(400, 'Can not find episodes'));

        var r = _.map(r, (e) => {
            return {
                id: e._id,
                name: e.name,
                desc: e.desc,
                scenes: e.scenes,
                created: e.created,
                owner: e.owner
            }
        });

        res.send(r)
    })
}

function getEpisodeById(req, res, done) {
    episode.findEpisodeById(req.params.episodeId, (e, r) => {
        if(e) return done(new HttpError(500, e));
        if(!r) return done(new HttpError(400, 'Can not find episode'));

        res.send({
            image: r.image,
            id: r._id,
            name: r.name,
            desc: r.desc,
            scenes: r.scenes,
            admin: r.admin
        })
    })
}

function createEpisode(req, res, done) {
    var model = {
        name: req.body.name,
        desc: req.body.desc,
        scenes: req.body.scenes,
        owner: req.owner,
        created: Date.now(),
    };

    async.series([
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
            episode.createEpisode(null, model, (e, r) => {
                if(e) return done(new HttpError(500, e));
                if(!r) return done(new HttpError(400, 'Can not create new episode'));

                res.send({
                    id: r._id,
                    name: r.name,
                    desc: r.desc,
                    scenes: r.scenes,
                    owner: r.owner,
                    created: r.created,
                })
            })
        }
    ])

    
}

function updateEpisode(req, res, done) {
    var model = {
        name: req.body.name,
        desc: req.body.desc,
        scenes: req.body.scenes,
        created: Date.now()
    };

    async.series([
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
            episode.updateEpisode(req.params.episodeId, model, (e, r) => {
                if(e) return done(new HttpError(500, e));
                if(!r) return done(new HttpError(400, 'Episode with this id not exists'));

                push.dataChangedPush({
                    type: 'updated',
                    episodeId: req.params.episodeId
                }, (e, r) => { console.log(e, r)})

                res.send({
                    id: r._id,
                    name: r.name,
                    desc: r.desc,
                    scenes: r.scenes,
                    owner: r.owner,
                    created: r.created
                })
            })
        }
    ])

    
}

function removeEpisode(req, res, done) {
    episode.removeEpisode(req.params.episodeId, null, (e, r) => {
        if(e) return done(new HttpError(500, e));
        if(!r) return done(new HttpError(400, 'Episode with this id not exists'));

        push.dataChangedPush({
            type: 'removed',
            episodeId: req.params.episodeId
        }, (e, r) => { console.log(e, r)})

        res.send()
    })
}

module.exports = {
    getAllEpisodes: getAllEpisodes,
    getEpisodeById: getEpisodeById,
    createEpisode: createEpisode,
    updateEpisode: updateEpisode,
    removeEpisode: removeEpisode
};
