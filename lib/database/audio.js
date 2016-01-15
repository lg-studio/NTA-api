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
function saveAudio(audioId, model, done) {
    Schema.Audio.update({ _id: audioId }, model, done)
}

/**
 * Returns image from the database for specific user
 * @param params {
 *     userId: '21ns8g2918d0f1',
 * }
 */
function getAudio(audioId, done) {
    Schema.Audio.findById(audioId, done)
}

/**
* Returns object id if stub exists
*/
function checkStub(audioId, done) {
    Schema.Audio.findById(audioId)
    .select('_id length uploaded')
    .exec(done)
}

module.exports = {
    getAudio: getAudio,
    checkStub: checkStub,
    saveAudio: saveAudio,
};
