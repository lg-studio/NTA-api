var idValidation = require('../util/middleware').idValidation;
var HttpError = require('../util/middleware').HttpError;
var Uploader = require('../util/uploader');
var Image = require('../database/image');
var Audio = require('../database/audio');
var tasklog = require('../database/tasklog');
var _ = require('underscore');
var async = require('async');

/**
 * Uploads image as a user avatar and stores its id in user profile
 */
function uploadAudio(req, res, done) {
    Uploader(req, (e, fields, files) => {
        if(e || files.length == 0)
            return done(new HttpError(400,  'Audio is not present'))

        var audio = files[0];

        if(audio.buffer.length !== audio.length || audio.buffer.length == 0)
            return done(new HttpError(400, 'Audio is corrupted or it\'s length is 0'))


        var model = {
            name: audio.name,
            filename: audio.filename,
            contentType: audio.contentType,
            length: audio.length,
            buffer: audio.buffer,
            uploaded: true
        }

        async.series([
            (next) => {
                Audio.checkStub(req.params.audioId, (e, r) => {
                    console.log(r)
                    if(e) return done(new HttpError(400, 'Error when checking audio stub'))
                    if(!r) return done(new HttpError(400, 'Audio stub does not exists'))
                    if(r.uploaded) return done(new HttpError(400, 'Audio already exists'))

                    next()
                })
            },
            (next) => {
                Audio.saveAudio(req.params.audioId, model, (e, r) => {
                    if(e) return done(new HttpError(400, 'Error when uploading audio'))
                    if(!r) return done(new HttpError(400, 'Audio was not saved because of error'))
                    res.send()
                });                
            }
        ])
    })
}

/**
 * Returns users audio
 */
function getAudio(req, res, done) {
    Audio.getAudio(req.params.audioId, (e, r) => {
        if(e) return done(new HttpError(400, 'Error when reading audio'))
        if(!r || (r && !r.uploaded)) return done(new HttpError(404))

        res.set('Content-Type', r.contentType);
        res.send(r.buffer);
    })
}

module.exports = {
    uploadAudio: uploadAudio,
    getAudio: getAudio,
    // getAudioById: getAudioById
};
