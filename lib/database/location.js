var Schema = require('./models');
var async = require('async');

/**
* Creates a character and adds it to specific task
* @params {
*     scene_id: '400aa234-1116-11e5-111b-1697f925ec7b',
*     name: 'Episode 1',
*     desc: 'some desc',
*     image: <buffer>
* }
*/
function createLocationForTask(params, done) {
    var image = new Schema.Image({
        name: params.image.name,
        filename: params.image.filename,
        contentType: params.image.contentType,
        length: params.image.length,
        buffer: params.image.buffer
    });

    var location = new Schema.Location({
        name: params.name,
        desc: params.desc,
        lon: params.lon,
        lat: params.lat,
        image: image._id
    })

    var classParams = {
        taskId: params.taskId,
        characterId: location._id
    }

    async.parallel([
        image.save,
        location.save,
        (next) => {
            Schema.Task.update({
                _id: params.taskId
            }, {
                location: params.characterId
            }, next )
        }
    ], (e, r) => {
        if(e) return done(e);
        done(null, location);
    })
}

/**
* Creates a character
* @params {
*     scene_id: '400aa234-1116-11e5-111b-1697f925ec7b',
*     name: 'Episode 1',
*     desc: 'some desc',
*     image: <buffer>
* }
*/
function createLocation(model, done) {
    var location = new Schema.Location(model);
    location.save( (e, r) => {
        if(e || !r) return done(e, r);

        Schema.Location.findOne({ _id: r._id })
            .select('-image')
            .exec(done)
    } );
}

/**
 * Finds all locations from the system
 * @param done
 */
function findAllLocations(done) {
    Schema.Location.find({})
    .select('-image')
    .exec(done)
}


function updateLocation(locationId, owner, model, done) {
    var find = { _id: locationId };
    if(owner) find.owner = owner;

    Schema.Location.findOneAndUpdate(find, model, {'new': true})
    .select('-image')
    .exec(done);

    // Schema.Location.update(find, model, (e, r) => {
    //     if(e || !r) return done(e, r);

    //     if(r.n == 1) {
    //         Schema.Location.findOne({ _id: locationId })
    //             .select('-image')
    //             .exec(done)
    //     } else return done(e)
    // });
}

/**
 * Finds location by id for admin
 * @param locationId
 * @param done
 */
function findLocationByIdAsAdmin(locationId, done) {
    Schema.Location.findOne({ admin: 'admin', _id: locationId }, done);
}

/**
 * Finds location by Id and owner
 * @param locationId String
 * @param owner String
 * @param done
 */
function findLocationById(locationId, done) {
    Schema.Location.findOne({
        _id: locationId
    })
    .select('-image')
    .lean()
    .exec(done)
}

function bindLocationToTask(params, done) {
    Schema.Task.update({
        _id: params.taskId
    }, {
        location: params.locationId
    }, done)
}

/**
 * Copies image to location
 * @param image
 * @param done
 */
function attachImage(id, image, done) {
    Schema.Location.findOneAndUpdate({ _id: id }, {
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

/**
 * Returns image for specific episode
 * @param id
 * @param done
 */
function findImage(locationId, done) {
    Schema.Location.findOne({ _id: locationId})
        .select('image')
        .exec(done);
}


function removeLocation(locationId, owner, done) {
    var find = { _id: locationId };
    if(owner) find.owner = owner;

    Schema.Location.findOneAndRemove(find, done);
}

module.exports = {
    findAllLocations: findAllLocations,
    findLocationById: findLocationById,
    createLocation: createLocation,
    updateLocation: updateLocation,
    removeLocation: removeLocation,


    findLocationByIdAsAdmin: findLocationByIdAsAdmin,
    createLocationForTask: createLocationForTask,
    bindLocationToTask: bindLocationToTask,

    attachImage: attachImage,
    findImage: findImage,
}
