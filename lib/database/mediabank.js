var Schema = require('./models');

/**
 * Returns all items in the mediabank
  * @param done
 */
function getMediabank(done) {
    Schema.Mediabank.find()
        .select('_id contentType filename')
        .exec(done)
}

/**
 * Finds one item in the mediabank
 * @param mediaId String
 * @param done
 */
function getMediabankItem(mediaId, done) {
    Schema.Mediabank.findById(mediaId)
        .select('_id contentType filename')
        .exec(done)
}

/**
 * Finds one item in the mediabank with content
 * @param mediaId String
 * @param done
 */
function getMediabankContent(mediaId, done) {
    Schema.Mediabank.findById(mediaId, done)
}


/**
 * Creates new item in the mediabank
 * @param params { name, filename, contentType, length, buffer }
 * @param done
 */
function createMediabankItem(params, done) {
    var mediaItem = new Schema.Mediabank({
        name: params.name,
        filename: params.filename,
        contentType: params.contentType,
        length: params.length,
        buffer: params.buffer
    });

    mediaItem.save(done);
    params.buffer = [];
}

/**
 * Replaces existing item in the mediabank
 * @param params { mediaId, name, filename, contentType, length, buffer }
 * @param done
 */
function updateMediabankItem(params, done) {
    var mediaItem = new Schema.Mediabank({
        name: params.name,
        filename: params.filename,
        contentType: params.contentType,
        length: params.length,
        buffer: params.buffer
    });

    mediaItem.findByIdAndUpdate(req.params.mediaId, {
        name: media.name,
        filename: media.filename,
        contentType: media.contentType,
        length: media.length,
        buffer: media.buffer
    }, done );
}

/**
 * Removes item from mediabank by id
 * @param params { mediaId }
 * @param done
 */
function removeMediabankItem(params, done) {
    Schema.Mediabank.remove({ _id: params.mediaId }, done)
}

module.exports = {
    getMediabank: getMediabank,
    getMediabankItem: getMediabankItem,
    getMediabankContent: getMediabankContent,
    createMediabankItem: createMediabankItem,
    updateMediabankItem: updateMediabankItem,
    removeMediabankItem: removeMediabankItem
};
