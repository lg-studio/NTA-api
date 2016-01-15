var Schema = require('./models');
var async = require('async');
var _ = require('underscore');

/**
 * Creates episode and binds it to the course if needed
 * @param courseId
 * @param model
 * @param done
 */
function createEpisode(courseId, model, done) {
    var episode = new Schema.Episode(model);

    episode.save( (e, r) => {
        done(e, episode);
        if(courseId) {
            Schema.Course.update({
                _id: courseId
            }, {
                $push: {
                    episodes: episode._id
                }
            });
        }
    });

    //var episode = new Schema.Episode({
    //    name: params.name,
    //    desc: params.desc,
    //    scenes: []
    //});
    //
    //episode.save( () => {
    //    Schema.Course.update({
    //        _id: params.courseId
    //    }, {
    //        $push: {
    //            episodes: episode._id
    //        }
    //    }, () => {});
    //    done(null, episode)
    //})
}

function findEpisodesByCourseId(params, done) {
    Schema.Course.findOne({
        _id: params.courseId
    }, (e, r) => {
        if(r) {
            Schema.Episode.find({
                _id: {
                    $in: r.episodes
                }
            }, done)
        }
        else done()
    })
}

function findAllEpisodesByCourseId(courseId, done) {
    Schema.Course.findOne({
        _id: courseId
    }, (e, r) => {
        if(e || !r) return done(e, []);
        
        if(r.episodes.length > 0) {
            Schema.Episode.find({
                _id: { $in: r.episodes }
            })
            .select('-image')
            .exec( (e, r) => {
                if(e || !r) done(e, []);

                 var f = _.map(r, (e) => {
                    return (next) => {
                        var data = {
                            id: e._id,
                            name: e.name,
                            desc: e.desc,
                            scenes: e.scenes,
                            created: e.created,
                            owner: e.owner
                        };

                        if(e.location) {
                            data.location = {
                                name: e.location.name,
                                desc: e.location.desc,
                                lon: e.location.lon,
                                lat: e.location.lat,
                            }
                        }

                        Schema.Scene.find({
                            _id: { $in: data.scenes }
                        })
                        .select('-image')
                        .exec((e, scenes) => {
                            if(e) return next(e);

                            data.scenes = _.map(scenes, (e) => {
                                var data = {
                                    id: e._id,
                                    name: e.name,
                                    desc: e.desc,
                                    tasks: e.tasks,
                                    created: e.created,
                                    shortInfo: e.shortInfo,
                                    state: e.state,
                                    owner: e.owner
                                }

                                if(e.location) {
                                    data.location = {
                                        name: e.location.name,
                                        desc: e.location.desc,
                                        lon: e.location.lon,
                                        lat: e.location.lat,
                                    }
                                }

                                return data;
                            });
                            next(null, data)
                        })
                    }
                });

                async.parallel(f, done)
            })
        }
        
    })
}

function findEpisodeById(episodeId, done) {
    Schema.Episode.findById(episodeId)
    .select('-image')
    .exec(done)
}

/**
 * Finds all episodes
 * @param done
 */
function findAllEpisodes(done) {
    Schema.Episode.find({})
    .select('-image')
    .exec(done)
}

/**
 * Updates episode
 * @param episodeId
 * @param params
 * @param done
 */
function updateEpisode(episodeId, model, done) {
    Schema.Episode.findByIdAndUpdate(episodeId, model)
    .select('-image')
    .exec(done)
}

function findAllEpisodesByAdmin(done) {
    Schema.Episode.find({ admin: true })
    .select('-image')
    .exec(done)
}

// TODO create image binding
function createEpisodeByAdmin(params, done) {
    var episode = new Schema.Episode(params);
    episode.save(done)
}

function updateEpisodeByAdmin(episodeId, params, done) {
    Schema.Episode.update({
        _id: episodeId,
        admin: true
    }, {
        $set: params
    })
    .select('-image')
    .exec(done)
}

// TODO unbind course
function removeEpisodeByAdmin(params, done) {
    Schema.Episode.findByIdAndRemove(params.episodeId, done);
}

/**
 * Removes episode and unbinds course from it
 * @param courseId
 * @param owner
 * @param done
 */
function removeEpisode(episodeId, owner, done) {
    var find = { _id: episodeId };
    if(owner) find.owner = owner;

    Schema.Episode.findOneAndRemove(find, (e, r) => {
        done(e, r);

        Schema.Course.update({
            episodes: episodeId
        }, {
            $pull: { episodes: episodeId }
        }).exec();
    })
}

function attachImage(id, image, done) {
    Schema.Episode.findOneAndUpdate({ _id: id }, {
        image: {
            filename: image.filename,
            contentType: image.contentType,
            length: image.length,
            buffer: image.buffer,
            created: image.created
        }
    })
    .select('_id')
    .lean().exec(done)
}

function findImage(id, done) {
    Schema.Episode.findById(id)
        .select('image')
        .exec(done);
}

module.exports = {
    //admin
    findAllEpisodesByAdmin: findAllEpisodesByAdmin,
    createEpisodeByAdmin: createEpisodeByAdmin,
    updateEpisodeByAdmin: updateEpisodeByAdmin,
    removeEpisodeByAdmin: removeEpisodeByAdmin,

    // user/teacher
    findAllEpisodes: findAllEpisodes,
    findEpisodeById: findEpisodeById,
    createEpisode: createEpisode,
    updateEpisode: updateEpisode,
    removeEpisode: removeEpisode,


    // other
    findEpisodesByCourseId: findEpisodesByCourseId,
    findAllEpisodesByCourseId: findAllEpisodesByCourseId,

    attachImage: attachImage,
    findImage: findImage
}
