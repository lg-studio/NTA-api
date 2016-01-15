var Schema = require('./models');
var async = require('async');
var _ = require('underscore');

/**
* Returns tasklog for specific user
*/
function findTasklogForUser(userId, done) {
    Schema.Tasklog.findOne({ user: userId }, done); 
}

function addTask(userId, model, done) {
    Schema.Tasklog.findOne({ user: userId }, (e, tasklog) => {
        if(e) return done(e);
        if(!tasklog) {
            // create new tasklog and attach data
            var tasklog = new Schema.Tasklog({
                user: userId,
                tasks: model
            })
            tasklog.save(done)
        } else {
            // attach data to existing tasklog
            tasklog.tasks.push(model)
            tasklog.save(done);
        }
    });
}

/**
* Rates specific chat item
*/
function rateChatItem(itemId, done) {
}

module.exports = {
    findTasklogForUser: findTasklogForUser,

    addTask: addTask,


    // rateChatItem: rateChatItem,
}