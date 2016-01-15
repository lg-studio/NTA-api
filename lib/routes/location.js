var idValidation = require('../util/middleware').idValidation;
var HttpError = require('../util/middleware').HttpError;
var Uploader = require('../util/uploader');
var Location = require('../database/location');
var async = require('async');
var _ = require('underscore');
var mediabank = require('../database/mediabank');

function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

function isEmpty(obj) {
    return Object.keys(obj.toObject()).length == 0;
}

function notEmpty(obj) {
    return Object.keys(obj.toObject()).length > 0;
}

/**
 * Creates a new character and uploads image as a user avatar
 * Binds this chaacter to specific class
 */
function createLocationForTask(req, res, done) {
    Uploader(req, (e, r) => {
        if(e || r.files.length == 0 ) return done(new HttpError(400, "Image is not present"));

        var image = r.files[0];

        if(image.buffer.length !== image.length || image.buffer.length == 0) return done(new HttpError(400, 'Image is corrupted or it\'s length is 0'));
        if(!r.name) return done(new HttpError(400, 'Name can not be empty'));
        if(!r.desc) return done(new HttpError(400, 'Description can not be empty'));
        if(!r.lat || !isNumber(r.lat)) return done(new HttpError(400, "lat should be present or it is no a number"));
        if(!r.lon || !isNumber(r.lon)) return done(new HttpError(400, "lon should be present or it is no a number"));

        var params = {
            user_id: req.user._id,
            task_id: req.params.taskId,
            name: r.name,
            desc: r.desc,
            lat: r.lat,
            lon: r.lon,
            image: {
                name: image.name,
                filename: image.filename,
                contentType: image.contentType,
                length: image.length,
                buffer: image.buffer
            }
        };

        Location.createLocationForTask(params, (e, r) => {
            if(e) return res.status(500, e).send()

            if(!r) {
                return res.status(400).send({
                    'error': 'Error creating new character'
                })
            }

            res.send({
                id: r._id,
                name: r.name,
                desc: r.desc,
                lat: r.lat,
                lon: r.lon,
                image: r.image
            })
        });
    })
}

/**
 * Creates a new character and uploads image as a user avatar
 */
function createLocation(req, res, done) {
    var model = {
        name: req.body.name,
        desc: req.body.desc,
        // lon: req.body.lon,
        // lat: req.body.lat,

        owner: req.owner,
        created: Date.now()
    };

    req.body.lon ? model.lon = req.body.lon : 0;
    req.body.lat ? model.lat = req.body.lat : 0;

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
            Location.createLocation(model, (e, r) => {
                if(e) return done(new HttpError(500, e));
                if(!r) return done(new HttpError(400, 'Can not create character'));

                var data = {
                    id: r.id,
                    name: r.name,
                    desc: r.desc,
                    lon: r.lon,
                    lat: r.lat,

                    created: r.created,
                    owner: r.owner
                }

                res.send(data);
                next()
            })
        }
    ]);
}

/**
 * Updates location with new data
 */
function updateLocation(req, res, done) {
    var model = {
        name: req.body.name,
        desc: req.body.desc,
        // lon: req.body.lon | 0,
        // lat: req.body.lat | 0,
    };

    req.body.lon ? model.lon = req.body.lon : 0;
    req.body.lat ? model.lat = req.body.lat : 0;

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
            var owner = req.owner == 'admin' ? null : req.owner;
            Location.updateLocation(req.params.locationId, owner, model, (e, r) => {
                if(e) return done(new HttpError(500, e));
                if(!r) return done(new HttpError(400, 'Can not create character or user is not owner of this character'));

                var data = {
                    id: r.id,
                    name: r.name,
                    desc: r.desc,
                    lon: r.lon,
                    lat: r.lat,

                    created: r.created,
                    owner: r.owner
                }

                res.send(data);
            })
        }
    ]);
}
/**
* Returns all characters in the system
*/
function getAllLocations(req, res, done) {
    Location.findAllLocations( (e, r) => {
        if(e) return done(new HttpError(500, e));

        var r = _.map(r, (e) => {
            return {
                id: e._id,
                name: e.name,
                desc: e.desc,
                lat: e.lat,
                lon: e.lon,

                owner: e.owner
            }
        })

        res.send(r)
    })
}

function getLocationById(req, res, done) {
    Location.findLocationById(req.params.locationId, (e, r) => {
        if(e) return done(new HttpError(500, e));
        if(!r) return done(new HttpError(400, 'Location with this id not exists'));

        res.send({
            id: r._id,
            name: r.name,
            desc: r.desc,
            lat: r.lat,
            lon: r.lon,

            owner: r.owner
        })
    })
}

/**
* Returns all characters in the system
*/
function bindLocationToTask(req, res, done) {
    var params = {
        location_id: req.body.location_id,
        task_id: req.body.task_id
    }

    Location.bindLocationToTask(params, (e, r) => {
        if(e) return done(new HttpError(500, e));
        res.send();
    })
}

/**
 * Returns image for specific location
 */
function getImageForLocation(req, res, done) {
    Location.findImage(req.params.locationId, (e, r) => {
        if(e) return done(new HttpError(500, e));
        if(!r || isEmpty(r.image)) return done(new HttpError(404));

        res.set('Content-Type', r.image.contentType);
        res.send(r.image.buffer)
    })
}

/**
 * Removes location by id
 */
function removeLocation(req, res, done) {
    var owner = req.owner == 'admin' ? null : req.owner;
    Location.removeLocation(req.params.locationId, owner, (e, r) => {
        if(e) return done(new HttpError(500, e));
        if(!r) return done(new HttpError(400, 'Location with this id not exists or you have no rights to remove this location'));

        res.send()
    })
}

module.exports = {
    getAllLocations: getAllLocations,
    getLocationById: getLocationById,
    createLocation: createLocation,
    updateLocation: updateLocation,
    removeLocation: removeLocation,

    bindLocationToTask: bindLocationToTask,
    createLocationForTask: createLocationForTask,

    getImageForLocation: getImageForLocation
};
