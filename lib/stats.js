var validate = require('./util/validator');
var tasklog = require('./routes/tasklog');

// var course = require('./routes/course');
// var episodes = require('./routes/episode');
// var scene = require('./routes/scene');
// var auth = require('./routes/auth');
// var _class = require('./routes/class');
// var task = require('./routes/task');
// var user = require('./routes/user');
// var image = require('./routes/image');
// var character = require('./routes/character');
// var location = require('./routes/location');
// var audio = require('./routes/audio');
// var push = require('./routes/push');
// var mediabank = require('./routes/mediabank');

var createTaskLog = {
    properties: {
        done: {
            type: "number",
            allowEmpty: false,
            required: false
        },
        taskId: {
            type: "string",
            allowEmpty: false,
            required: true,
            minLength: 24,
            maxLength: 24
        },
        rating: {
            type: "number",
            allowEmpty: false,
            required: false,
            minimum: 0,
            maximum: 100
        },
        chatType: {
            type: "string",
            allowEmpty: false,
            required: true,
            enum: ['TEXT', 'RECOGNITION'],
            message: 'must be of type TEXT or RECOGNITION'
        },
        chat: {
            type: "array",
            required: true,
            allowEmpty: true,
            items: {
                type: "object",
                maxItems: 50,
                allowEmpty: 'true',
                required: true,
                properties: {
                    text: {
                        type: "string",
                        allowEmpty: false,
                        required: true
                    },
                    tries: {
                        type: "number",
                        allowEmpty: false,
                        required: true,
                        minimum: 0
                    },
                    answer: {
                        type: "string",
                        allowEmpty: false,
                        required: true
                    },
                    result: {
                        type: "number",
                        allowEmpty: false,
                        required: false,
                        minimum: 0,
                        maximum: 5
                    },
                    audioResponseId: {
                        type: "string",
                        allowEmpty: false,
                        required: true,
                        minLength: 24,
                        maxLength: 24
                    },
                }
            }
        },
    }
}

module.exports = {
    getTasklog: validate({ rights: ['user', 'teacher', 'admin'] }, tasklog.getTasklog),
    logTask: validate({ schema: createTaskLog, rights: ['user'], ids:['taskId'] }, tasklog.logTask),
    getTasklogForUser: validate({ rights: ['user', 'teacher', 'admin'], ids:['userId'] }, tasklog.getTasklogForUser),
}