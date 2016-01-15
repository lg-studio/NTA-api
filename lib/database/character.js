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
function createCharacterForTask(params, done) {
    var image = new Schema.Image({
        name: params.image.name,
        filename: params.image.filename,
        contentType: params.image.contentType,
        length: params.image.length,
        buffer: params.image.buffer
    });

    var character = new Schema.Character({
        name: params.name,
        desc: params.desc,
        image: image._id
    })

    var classParams = {
        taskId: params.taskId,
        characterId: character._id
    }

    async.parallel([
        image.save,
        character.save,
        (next) => {
            Schema.Task.update({
                _id: params.taskId
            }, {
                character: params.characterId
            }, next )
        }
    ], (e, r) => {
        if(e) return done(e);
        done(null, character);
    })
}

/**
 * Finds character by id for admin
 * @param characterId String
 * @param done
 */
function findCharacterByIdAsAdmin(characterId, done) {
    Schema.Character.findOne({ _id: characterId })
    .select('-image')
    .exec(done);
}

/**
 * Finds character by id for tutor, user
 * @param characterId String
 * @param done
 */
function findCharacterById(characterId, done) {
    Schema.Character.findOne({ _id: characterId })
    .select('-image')
    .exec(done);
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
//function createCharacter(params, done) {
//    var image = new Schema.Image({
//        name: params.image.name,
//        filename: params.image.filename,
//        contentType: params.image.contentType,
//        length: params.image.length,
//        buffer: params.image.buffer
//    });
//
//    var character = new Schema.Character({
//        name: params.name,
//        desc: params.desc,
//        image: image._id
//    });
//
//    async.parallel([
//        image.save,
//        character.save
//    ], (e, r) => {
//        if(e) return done(e);
//        done(null, character);
//    })
//}

//
///**
// * Creates character and marks it as admin
// */
//function createCharacter(model, done) {
//    var character = new Schema.Character(model);
//    character.save(done)
//}

/**
 * Creates character and marks it as admin
 */
function createCharacter(model, done) {
    var character = new Schema.Character(model);
    character.save( (e, r) => {
        if(e || !r) return done(e, r);

        Schema.Character.findOne({ _id: r._id })
        .select('-image')
        .exec(done)
    } )
}

/**
* Finds task attached to scene
* @params {
*     scene_id: '81ged37rf2ge1-ef'
* }
*/
function findTasksBySceneId(params, done) {
    Schema.Scene.findOne({
        _id: params.sceneId
    }, (e, r) => {
        if(r) {
            Schema.Character.find({
                _id: {
                    $in: r.tasks
                }
            }, (e, r) => {
                done(null, r)
            })
        } else done()
    })
}

/**
* Finds all characters in the system
*/
function findAllCharacters(done) {
    Schema.Character.find({})
        .select('-image')
        .exec(done)
}

/**
* Finds all characters in the system
* @params {
*     task_id: '81ged37rf2ge1-ef',
*     character_id: '21d24f219dg210dgf10'
* }
*/
function bindCharacterToTask(params, done) {
    Schema.Task.update({
        _id: params.taskId
    }, {
        character: params.characterId
    }, done)
}

/**
 * Copies image to character
 * @param image
 * @param done
 */
function attachImage(id, image, done) {
    Schema.Character.findOneAndUpdate({ _id: id }, {
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
function findImage(imageId, done) {
    Schema.Character.findById(imageId)
        .select('image')
        .exec(done);
}

/**
 * Removes character by id
 * @param characterId String
 * @param done
 */
function removeCharacter(characterId, owner, done) {
    Schema.Character.findByIdAndRemove(characterId)
        .select('_id')
        .exec(done);
}


function updateCharacter(characterId, owner, model, done) {
    var find = { _id: characterId };
    if(owner) find.owner = owner;

    Schema.Character.findOneAndUpdate(find, model, {'new': true}, done)
}

module.exports = {
    // admin
    //createCharacterByAdmin: createCharacterByAdmin,

    findAllCharacters: findAllCharacters,
    findCharacterById: findCharacterById,
    createCharacter: createCharacter,
    updateCharacter: updateCharacter,
    removeCharacter: removeCharacter,
    createCharacterForTask: createCharacterForTask,



    bindCharacterToTask: bindCharacterToTask,
    findCharacterByIdAsAdmin: findCharacterByIdAsAdmin,

    attachImage: attachImage,
    findImage: findImage,
}
