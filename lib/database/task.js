var Schema = require('./models')
var async = require('async');

function findTasksBulk(tasks, done) {
    console.log(tasks);
    Schema.Task.find({
        _id: { $in: tasks }
    })
    .select('_id')
    .lean()
    .exec(done)
}

/**
 * Returns all tasks from the system
 * @param done
 */
function findAllTasks(done) {
    Schema.Task.find()
        .select('-image -character.image -location.image')
        .exec(done)
}

/**
 * Updates task by id
 * @param taskId
 * @param done
 */
function updateTask(taskId, owner, model, done) {
    var find = { _id: taskId };
    if(owner) find.owner = owner;

    Schema.Task.findOneAndUpdate(find, model, {'new': true}, done)
}

/**
 * Removes task by id
 * @param taskId
 * @param owner
 * @param done
 */
function removeTask(taskId, owner, done) {
    var find = { _id: taskId };
    if(owner) find.owner = owner;

    Schema.Task.findOneAndRemove(find, (e, r) => {
        Schema.Scene.update({
            tasks: taskId
        }, {
            $pull: { tasks: taskId }
        }).exec();

        done(e, r);
    })
}

/**
 * Creates new task and binds it to some scene
 * @param sceneId
 * @param owner
 * @param model
 * @param done
 */
function createTask(sceneId, model, done) {
    var task = new Schema.Task(model);

    task.save( (e) => {
        done(e, task);

        if(sceneId) {
            Schema.Scene.findByIdAndUpdate(sceneId, {
                $push: {
                    tasks: task._id
                }
            } )
        }
    });
    //
    //if(params.characterId) {
    //    tasks.push((next) => {
    //        Schema.Character.findById(params.characterId, (e, r) => {
    //            if(r) next();
    //            else next(new Error('Character with this id not exist'))
    //        } )
    //    });
    //}
    //
    //if(params.locationId) {
    //    tasks.push((next) => {
    //        Schema.Location.findById(params.locationId, (e, r) => {
    //            if(r) next();
    //            else next(new Error('Location with this id not exist'))
    //        })
    //    });
    //}

    //async.parallel(tasks, (e, r) => {
    //    if(e) return done({
    //        error: 'custom',
    //        message: e.message
    //    })
    //
    //
    //})
}

/**
* Finds task attached to scene
* @params {
*     sceneId: '81ged37rf2ge1-ef'
* }
*/
function findTasksBySceneId(sceneId, done) {
    Schema.Scene.findById(sceneId)
        .select('-image -location.image')
        .exec((e, r) => {
            if(e || !r) return done(e, r)

            Schema.Task.find({
                _id: { $in: r.tasks }
            })
            .select('-image -character.image -location.image')
            .exec(done)
        })
}

/**
* Finds task by id
* @params taskId
*/
function findTaskById(taskId, done) {
    Schema.Task.findById(taskId)
        .select('-image -character.image -location.image')
        .exec(done)
}

/**
* Adds character to class
* @params {
*     taskId: '1r3r312s-13f24gf1d-21de1',
*     character_id: '2d819gf89gf01d1'
*/
function addCharacter(params, done) {
    Schema.Character.findById(params.character_id, (e, r) => {
        if(e) return done(e);

        Schema.Task.findByIdAndUpdate(params.taskId, {
            character: r
        }, done )
    })

    // if(done) done(null, class)
}

/**
* Finds all tasks
*/
function findAllTasksByAdmin(admin, done) {
    Schema.Task.find({ admin: true })
    .select( '-image -character.image -location.image' )
    .exec(done)
}

/**
 * Creates task and marks it as created by admin
 * @param model taskModel
 * @param done
 */
function createTaskByAdmin(model, done) {
    var task = new Schema.Task(model);
    task.save(done);
}

/**
* Updates new task
* @params {
*     sceneId: sceneId,
*     name: 'Episode name',
*     desc: 'Episode description',
*     tasks: [ 'taskId' ]
* }
*/
function updateTaskByAdmin(taskId, model, done) {
    Schema.Task.update({
        _id: taskId,
        admin: true
    }, model, (e, r) => {
        if(e) return done(e);
        if(r.n == 1) {
            Schema.Task.findOne({ _id: taskId, admin: true})
                .select('-image -location.image -character.image')
                .exec(done)
        } else return done(e)
    })
}

/**
* Removes new task
* @params {
*     taskId: taskId
* }
*/
function removeTaskByAdmin(taskId, done) {
    Schema.Task.findByIdAndRemove(taskId)
    .select('_id')
    .exec(done);
}

/**
 * Copies image to task
 * @param image
 * @param done
 */
function attachImage(id, image, done) {
    Schema.Task.findOneAndUpdate({ _id: id }, {
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

function findImage(taskId, done) {
    Schema.Task.findById(taskId)
        .select('image')
        .exec(done);
}

module.exports = {
    findAllTasks: findAllTasks,
    findTaskById: findTaskById,
    createTask: createTask,
    updateTask: updateTask,
    removeTask: removeTask,


    // admin
    findTasksBulk: findTasksBulk,
    findAllTasksByAdmin: findAllTasksByAdmin,
    createTaskByAdmin: createTaskByAdmin,
    updateTaskByAdmin: updateTaskByAdmin,
    removeTaskByAdmin: removeTaskByAdmin,


    // user/teacher
    addCharacter: addCharacter,
    findTasksBySceneId: findTasksBySceneId,



    attachImage: attachImage,
    findImage: findImage
}
