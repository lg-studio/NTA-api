var Schema = require('./models');
var async = require('async');
var _ = require('underscore');

/**
* Finds user by id and returns basic info about him
* @params { id }
*/
function findUserById(userId, done) {
    Schema.User.findById(userId)
    .select('-image -password')
    .exec(done)
}

/**
 * Creates user
 * @param params
 * @param done
 */
function createUser(model, done) {
    var user = new Schema.User(model);
    user.save(done);
}

/**
* Removes user from the system
* @params { id }
*/
function removeUserFromClass(params, done) {
    Schema.Class.findByIdAndUpdate(params.classId, {
        $pull: {
            users: params.userId
        }
    }, next);
}

/**
* Finds user by token and returns basic info about him
* @params { token }
*/
function findUserByToken(token, done) {
    Schema.User.findOne({
        token: token
    })
    .select('-image -password')
    .exec(done)
}

/**
* Adds a new user/student in the database
* @params {
*     first_name: 'John',
*     last_name: 'Doe',
*     email: 'some@mail.com',
*     password: 'some_pass',
*     token: 'some_new_token',
*     classId: 'm12g0d320dfg1d'
* }
*/
function addUser(params, done) {
    var user = new Schema.User({
        first_name: params.first_name,
        last_name: params.last_name,
        email: params.email,
        password: params.password,
        token: params.token,
        classes: params.classes,
        role: 'user'
    });

    user.save(done);
}

/**
* Updates user data with new
* @params {
*     first_name: 'John',
*     last_name: 'Doe',
*     email: 'some@mail.com',
*     password: 'some_pass',
*     id: '400aa43e-1676-11e5-b60b-1697f925ec7b'
* }
*/
function updateUser(userId, owner, model, done) {
    var find = { _id: userId };
    if(owner) find.owner = owner;

    Schema.User.findByIdAndUpdate(userId, model, { 'new': true }, done)
}

function removeUser(userId, owner, done) {
    var find = { _id: userId };
    if(owner) find.owner = owner;

    Schema.User.findByIdAndRemove(find, done)
}

/**
* removes user with specific id
* @params {
*     id: '400aa43e-1676-11e5-b60b-1697f925ec7b'
* }
*/
function removeUserById(params, done) {
    Schema.User.findByIdAndRemove(params.id, done)
}

/**
* finds user by email
* @params email
*/
function findByEmail(email, done) {
    Schema.User.findOne({
        email: email
    })
    .select('-image')
    .exec(done)
}

/**
* finds user by email and pass pair
* @params {
*     email: 'some@mail.com',
*     pass: 'password'
* }
*/
function findByEmailPass(params, done) {
    Schema.User.findOne({
        email: params.email,
        password: params.password
    })
    .select('-image')
    .exec(done)
}

// token functions
function saveToken(userId, token, done) {
    Schema.User.findByIdAndUpdate(userId, {
        token: token
    }, (e, r) => {
        Schema.User.findOne( { _id: userId })
        .select('-image -password')
        .exec(done)
    })
}

function removeToken(userId, done) {
    Schema.User.findByIdAndUpdate(userId, {
        token: null
    }, done)
}

/**
* Saves android registration ID for specific user
* @params {
*    userId: '2d83gf1p39dg1'
*    registrationId: 'nad03gd1d1'
* }
*/
function saveDeviceRegistrationId(params, done) {
    Schema.User.findByIdAndUpdate(params.userId, {
        deviceRegistrationId: params.deviceRegistrationId
    }, done)
}

/**
* Returns all users which are in the system
*/
function findAllUsers(done) {
    Schema.User.find({})
    .select('-image -password')
    .exec(done)
}

// admin functions
function addUserByAdmin(model, done) {
    var user = new Schema.User(model);
    user.save(done)
}

function updateUserByAdmin(userId, model, done) {
    Schema.User.findByIdAndUpdate(userId, model)
        .select('-image')
        .exec(done)
}

function removeUserByAdmin(userId, done) {
    async.waterfall([
        (next) => {
            Schema.User.findOneAndRemove({
                _id: userId
            }, next);
        },
        (data, next) => {
            console.log(data);
            if(data) {
                if(data.classes && data.classes.length > 0) {
                    var tasks = [];

                    _.each(data.classes, (e) => {
                        tasks.push( (next) => {
                            Schema.Class.findByIdAndUpdate(e, {
                                $pull: {
                                    users: data._id
                                }
                            }, next)
                        })
                    });
                    async.parallel(tasks, next)
                } else next(null, data)
            } else next()
        }], done)
}

function findImage(userId, done) {
    Schema.User.findById(userId)
        .select('image')
        .exec(done);
}

function findDeviceIds(done) {
    Schema.User.find({ deviceRegistrationId: { $exists: true, $ne: null } })
        .select('deviceRegistrationId')
        .exec(done)
}

function findByPasswordToken(token, done) {
    Schema.User.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } })
    .select('-image')
    .exec(done)
}

/**
 * Copies image to task
 * @param image
 * @param done
 */
function attachImage(id, image, done) {
    Schema.User.findOneAndUpdate({ _id: id }, {
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

module.exports = {
    findAllUsers: findAllUsers,
    findUserById: findUserById,
    createUser: createUser,
    updateUser: updateUser,
    removeUser: removeUser,

    // auth
    findByEmail: findByEmail,
    findUserByToken: findUserByToken,
    saveToken: saveToken,
    removeToken: removeToken,

    // admin
    addUserByAdmin: addUserByAdmin,
    updateUserByAdmin: updateUserByAdmin,
    removeUserByAdmin: removeUserByAdmin,

    // teacher/user


    findByEmailPass: findByEmailPass,
    removeUserById: removeUserById,


    removeUserFromClass: removeUserFromClass,

    saveDeviceRegistrationId: saveDeviceRegistrationId,

    findDeviceIds: findDeviceIds,

    findImage: findImage,

    findByPasswordToken: findByPasswordToken,
    attachImage: attachImage,
}
