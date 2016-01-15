var episode = require('../database/episode');
var course = require('../database/course');
var uuid = require('node-uuid');
var _ = require('underscore');
var idValidation = require('../util/middleware').idValidation;
var HttpError = require('../util/middleware').HttpError;
var push = require('./push')
var async = require('async');

/**
* Returns all episodes in the course scope
*/
function getEpisodes(req, res, done) {
    var params = {
        id: req.user._id,
        courseId: req.params.courseId
    };
    episode.findEpisodesByCourseId(params, (e, r) => {
        if(e) return done(new HttpError(500, e));
        if(!r) return done(new HttpError(400, 'Error finding episodes by course id'));

        var data = _.map(r, (e) => {
            return {
                // image: e.image,
                id: e._id,
                name: e.name,
                desc: e.desc,
                scenes: e.scenes
            }
        });

        res.send(data)
    })
}

/**
 * Returns all episodes in the course scope and full info about scenes
 */
function getEpisodesAll(req, res, done) {
    episode.findAllEpisodesByCourseId(req.params.courseId, (e, r) => {
        if(e) return done(new HttpError(500, e));
        if(!r) return done(new HttpError(400, 'Error finding episodes by course id'));

        res.send(r)
    })
}

/**
* Creates course
*/
function createEpisode(req, res, done) {
    var model = {
        name: req.body.name,
        desc: req.body.desc,
        episodes: req.body.episodes,
        created: Date.now(),
        owner: req.owner
    };

    episode.createEpisode(req.params.courseId, model, (e, r) => {
        if(e) return done(new HttpError(500, e));
        if(!r) return done(new HttpError(400, 'Error creating episode'));

        push.dataChangedPush({
            type: 'created',
            courseId: req.params.courseId,
            episodeId: r._id
        }, (e, r) => { console.log(e, r)})

        res.send({
            id: r._id,
            name: r.name,
            desc: r.desc,
            scenes: r.scenes
        })
    })
}

/**
* Returns one episode
*/
function getEpisode(req, res, done) {
    episode.findEpisodeById(req.params.episodeId, (e, r) => {
        if(e) return done(new HttpError(500, e));
        if(!r) return done(new HttpError(400, 'No episode with this id'));

        res.send({
            // image: r.image,
            id: r._id,
            name: r.name,
            desc: r.desc,
            created: r.created,
            owner: r.owner,
            scenes: r.scenes
        })
    })
}

/**
* Returns episode based on uuid in the course scope
*/
function getEpisodeById(req, res, done) {
     async.series([
        (next) => {
            if(req.params.course) {
                course.findCourseById(req.params.courseId, (e, r) => {
                    if(e) return done(new HttpError(500, e));
                    if(!r) return done(new HttpError(400, 'Course with this uuid does not exists'));
                    next()
                })
            }
        },
        (next) => {
            episode.findEpisodeById(req.params.episodeId, (e, r) => {
                if(e) return done(new HttpError(500, e));
                if(!r) return done(new HttpError(400, 'No episode with this id'));

                res.send({
                    // image: r.image,
                    id: r._id,
                    name: r.name,
                    desc: r.desc,
                    scenes: r.scenes
                })
            })
        }
    ])
}

/**
 * Returns image for specific episode
 * @param req
 * @param res
 * @param done
 */
function getImageForEpisode(req, res, done) {
    var o = {
        episodeId: req.params.episodeId
    };

    var v = idValidation( [ req.params.episodeId ] );
    if(!v.valid) return done(new HttpError(400, v.errors));

    episode.findImage(o.episodeId, (e, r) => {
        if(e) return done(new HttpError(500, e));
        if(!r) return done(new HttpError(404));

        res.set('Content-Type', r.image.contentType);
        res.send(r.image.buffer)
    })
}

module.exports = {
    getEpisode: getEpisode,
    getEpisodes: getEpisodes,
    getEpisodeById: getEpisodeById,
    getEpisodesAll: getEpisodesAll,
    createEpisode: createEpisode,
    getEpisodeById: getEpisodeById,

    getImageForEpisode: getImageForEpisode
}
