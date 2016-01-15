var idValidation = require('../util/middleware').idValidation;
var HttpError = require('../util/middleware').HttpError;
var Uploader = require('../util/uploader');
var Image = require('../database/image');
var _ = require('underscore');

/**
 * Uploads image as a user avatar and stores its id in user profile
 */
function uploadImage(req, res, done) {
    Uploader(req, (e, fields, files) => {
        if(e || files.length == 0 )
            return done(new HttpError(400,  'Image is not present'));

        var image = files[0];

        if(image.buffer.length !== image.length || image.buffer.length == 0)
            return done(new HttpError(400, 'Image is corrupted or it\'s length is 0'));

        var params = {
            userId: req.user._id,
            name: image.name,
            filename: image.filename,
            contentType: image.contentType,
            length: image.length,
            buffer: image.buffer
        };

        Image.saveImage(params, (e, r) => {
            res.send();
            params.buffer = [];
        });
    })
}

/**
 * Returns users image
 */
function getImage(req, res, done) {
    var params = {
        userId: req.params.userId
    };

    var v = idValidation( [req.params.userId ]);
    if(!v.valid) return next(new HttpError(400, v.errors));

    Image.getImage(params, (e, r) => {
        if(e) return done(new HttpError(400, 'Error when getting reading user image'));
        if(!r) return done(new HttpError(404));

        res.set('Content-Type', r.contentType);
        res.send(r.buffer);
    })
}

/**
 * Returns image based on its id
 */
function getImageById(req, res, done) {
    var params = {
        userId: req.params.imageId
    };

    var v = idValidation( [req.params.imageId ]);
    if(!v.valid) return next(new HttpError(400, v.errors));

    Image.getImageById(params, (e, r) => {
        if(e) return done(new HttpError(400, 'Error when getting image'));
        if(!r) return done(new HttpError(404));

        res.set('Content-Type', r.contentType);
        res.send(r.buffer);
    })
}

module.exports = {
    uploadImage: uploadImage,
    getImage: getImage,
    getImageById: getImageById
};
