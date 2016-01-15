var Schema = require('./models');

/**
 * Store image buffer data to the database and
 * create a link to its id and store in the related user object
 * @param params {
 *     userId: '21ns8g2918d0f1',
 *     name: 'Image name',
 *     contentType: 'image/jpeg',
 *     length: 612644,
 *     buffer: < 4F 2C AA 09 42 EA ... >
 * }
 */
function saveImage(params, done) {
    var image = new Schema.Image({
        name: params.name,
        filename: params.filename,
        contentType: params.contentType,
        length: params.length,
        buffer: params.buffer
    });

    image.save( (e, r) => {
        if(e || !r) return done(e);

        Schema.User.update({
            _id: params.userId
        }, {
            image: image._id
        }, (e, r) => {
            if(e) return done(e);

            return done(null, r)
        });
    })
}

/**
 * Returns image from the database for specific user
 * @param params {
 *     userId: '21ns8g2918d0f1',
 * }
 */
function getImage(params, done) {
    Schema.User.findOne({
        _id: params.userId
    }, (e, r) => {
        if(e) return done(e);
        if(!r) return done(null, r);

        Schema.Image.findOne({
            _id: r.image
        }, done);
    })
}

/**
 * Returns image from the database with specific id
 * @param params {
 *     image_id: '21ns8g2918d0f1',
 * }
 */
function getImageById(params, done) {
    Schema.Image.findOne({
        _id: params.imageId
    }, done)
}

module.exports = {
    saveImage: saveImage,
    getImage: getImage,
    getImageById: getImageById
};
