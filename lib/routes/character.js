var idValidation = require('../util/middleware').idValidation;
var HttpError = require('../util/middleware').HttpError;
var Uploader = require('../util/uploader');
var Character = require('../database/character');
var _ = require('underscore');
var mediabank = require('../database/mediabank');
var async = require('async');

function isEmpty(obj) {
    return Object.keys(obj.toObject()).length == 0;
}

/**
 * Creates a new character and uploads image as a user avatar
 * Binds this chaacter to specific class
 */
function createCharacterForTask(req, res, done) {
    Uploader(req, (e, r) => {
        if(e || r.files.length == 0 ) return done(new HttpError(400, 'Image not present'))

        var image = r.files[0];

        if(image.buffer.length !== image.length || image.buffer.length == 0)
            return done(new HttpError(400, 'Image is corrupted or it\'s length is 0'))
        if(!r.name) return done(new HttpError(400, 'Name can not be empty'))
        if(!r.desc) return done(new HttpError(400, 'Description can not be empty'))

        var params = {
            user_id: req.user._id,
            task_id: req.params.taskId,
            name: r.name,
            desc: r.desc,
            image: {
                name: image.name,
                filename: image.filename,
                contentType: image.contentType,
                length: image.length,
                buffer: image.buffer
            }
        };

        Character.createCharacterForTask(params, (e, r) => {
            if(e) return done(new HttpError(500, e))
            if(!r) return done(new HttpError(400, 'Error creating new character'))

            res.send({
                id: r._id,
                name: r.name,
                desc: r.desc,
                image: r.image
            })
        });
    })
}

/**
 * Creates a new character and uploads image as a user avatar
 */
function createCharacter(req, res, done) {
    var model = {
        name: req.body.name,
        desc: req.body.desc,
        created: Date.now(),

        owner: req.owner
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
            Character.createCharacter(model, (e, r) => {
                if(e) return done(new HttpError(500, e));
                if(!r) return done(new HttpError(400, 'Can not create character'));

                var data = {
                    id: r.id,
                    name: r.name,
                    desc: r.desc,
                    created: r.created,
                    owner: r.owner
                }

                res.send(data);
                next()
            })
        }
    ]);
}

function updateCharacter(req, res, done) {
    var model = {
        name: req.body.name,
        desc: req.body.desc,
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
            var owner = req.owner == 'admin' ? null : req.owner;
            Character.updateCharacter(req.params.characterId, owner, model, (e, r) => {
                if(e) return done(new HttpError(500, e));
                if(!r) return done(new HttpError(400, 'Can not create character'));

                var data = {
                    id: r.id,
                    name: r.name,
                    desc: r.desc,
                    created: r.created,
                    owner: r.owner
                };

                res.send(data);
                next()
            })
        }
    ]);
}

/**
* Returns all characters in the system
*/
function getAllCharacters(req, res, done) {
    Character.findAllCharacters( (e, r) => {
        if(e) return done(new HttpError(500, e));

        var r = _.map(r, (e) => {
            return {
                id: e._id,
                name: e.name,
                desc: e.desc,
                owner: e.owner
            }
        });

        res.send(r)
    })
}

/**
 * Returns character by id
 */
function getCharacterById(req, res, done) {
     Character.findCharacterById(req.params.characterId, (e, r) => {
        if(e) return done(new HttpError(500, e));
        if(!r) return done(new HttpError(400, 'Characters with this id not exist'));

        res.send({
            id: r._id,
            name: r.name,
            desc: r.desc,
            owner: r.owner
        })
    })
}

/**
* Returns all characters in the system
*/
function bindCharacterToTask(req, res, done) {
    var params = {
        character_id: req.body.character_id,
        task_id: req.body.task_id
    }

    Character.bindCharacterToTask(params, (e, r) => {
        if(e) return done(new HttpError(500, e));

        res.send();
    })
}

/**
 * Returns image for specific character
 */
function getImageForCharacter(req, res, done) {
    Character.findImage(req.params.characterId, (e, r) => {
        if(e) return done(new HttpError(500, e));
        if(!r || isEmpty(r.image)) return done(new HttpError(404));

        res.set('Content-Type', r.image.contentType);
        res.send(r.image.buffer)
    })
}


/**
 * Removes character
 */
function removeCharacter(req, res, done) {
    var owner = req.owner == 'admin' ? null : req.owner;
    Character.removeCharacter(req.params.characterId, owner, (e, r) => {
        if(e) return done(new HttpError(500, e));
        if(!r) return done(new HttpError(400, 'Character with this id not exists'));

        res.send()
    })
}


module.exports = {
    getAllCharacters: getAllCharacters,
    getCharacterById: getCharacterById,
    createCharacter: createCharacter,
    updateCharacter: updateCharacter,
    removeCharacter: removeCharacter,

    //bindCharacterToTask: bindCharacterToTask,
    //createCharacterForTask: createCharacterForTask,

    getImageForCharacter: getImageForCharacter
};
