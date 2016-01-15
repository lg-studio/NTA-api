var Schema = require('./models');

//function createScene(o, done) {
//    var scene = new Schema.Scene(o);
//
//    scene.save( (e, r) => {
//        Schema.Episode.findByIdAndUpdate( o.episodeId, {
//            $push: {
//                scenes: scene._id
//            }
//        }, (e, r) => {
//            done(null, scene) } )
//    });
//}

/**
 * Creates scene and binds it to episode if needed
 * @param episodeId
 * @param model
 * @param done
 */
function createScene(episodeId, model, done) {
    var scene = new Schema.Scene(model);
    scene.save( (e, r) => {
        done(e, scene);
        if(episodeId) {
            Schema.Episode.findByIdAndUpdate(episodeId, {
                $push: {
                    scenes: scene._id
                }
            } )
        }
    });
}

/**
 * Updates specific scene
 * @param sceneId
 * @param owner
 * @param model
 * @param done
 */
function updateScene(sceneId, owner, model, done) {
    var find = { _id: sceneId };
    if(owner) find.owner = owner;

    Schema.Scene.findOneAndUpdate(find, model, {'new': true}, done)
}

/**
 * Removes scene
 * @param courseId
 * @param owner
 * @param done
 */
function removeScene(sceneId, owner, done) {
    var find = { _id: sceneId };
    if(owner) find.owner = owner;

    Schema.Scene.findOneAndRemove(find, (e, r) => {
        Schema.Episode.update({
            scenes: sceneId
        }, {
            $pull: { scenes: sceneId }
        }).exec();

        done(e, r);
    })
}

/**
* Finds episode attached to class
* @params {
*     episodeId: 'episodeId'
* }
*/
function findScenesByEpisodeId(o, done) {
    Schema.Episode.findById(o.episodeId, (e, r) => {
        if(r) {
            Schema.Scene.find({
                _id: { $in: r.scenes }
            }, done)
        } else done()
    })
}

function findSceneById(sceneId, done) {
    Schema.Scene.findById(sceneId)
        .select('-image -location.image')
        .exec(done)
}

function findSceneByIdAsAdmin(sceneId, done) {
    Schema.Scene.findOne({
        _id: sceneId,
        admin: 'admin'
    })
    .select('-image -location.image')
    .exec(done)
}

/**
 * Finds all scenes from the system
 * @param done
 */
function findAllScenes(done) {
    Schema.Scene.find({})
    .select('-image -location.image')
    .exec(done)
}

function findAllScenesAsAdmin(done) {
    Schema.Scene.find({ admin: true })
        .select('-image -location.image')
        .exec(done)
}

/**
 * Creates new scene
 * @param model String
 */
function createSceneByAdmin(model, done) {
    var scene = new Schema.Scene(model);
    scene.save(done)
}

/**
 * Updates scene
 * @param sceneId String
 * @param model String
 * @param done
 */
function updateSceneByAdmin(sceneId, model, done) {
    Schema.Scene.update({
        _id: sceneId,
        admin: true
    }, model)
    .exec( (e, r) => {
        if(e) return done(e);
        if(r.n == 1) {
            Schema.Scene.findById(sceneId)
                .select('-image -location.image')
                .exec(done)
        } else return done(e, r)
    } )
}

/**
 * Removes already existing scene
 * @param sceneId String
 * @param done
 */
function removeSceneByAdmin(sceneId, done) {
    Schema.Scene.findByIdAndRemove(sceneId, done);
}

/**
 * Removes new episode
 * @params {
*     sceneId
*     imageId
* }
 */
function attachImageToScene(o, done) {
    Schema.Scene.findByIdAndUpdate(o.sceneId, {
        image: o.imageId
    }, done);
}

/**
 * Copies image to scene
 * @param image
 * @param done
 */
function attachImage(id, image, done) {
    Schema.Scene.findOneAndUpdate({ _id: id }, {
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

function findImage(sceneId, done) {
    Schema.Scene.findById(sceneId)
        .select('image')
        .exec(done);
}

module.exports = {
    //admin
    findAllScenes: findAllScenes,
    findSceneById: findSceneById,
    createScene: createScene,
    updateScene: updateScene,
    removeScene: removeScene,


    findAllScenesAsAdmin: findAllScenesAsAdmin,
    createSceneByAdmin: createSceneByAdmin,
    updateSceneByAdmin: updateSceneByAdmin,
    removeSceneByAdmin: removeSceneByAdmin,

    // user/teacher
    findScenesByEpisodeId: findScenesByEpisodeId,


    findSceneByIdAsAdmin: findSceneByIdAsAdmin,

    attachImageToScene: attachImageToScene,

    attachImage: attachImage,
    findImage: findImage,
};
