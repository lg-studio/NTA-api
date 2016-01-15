var validate = require('./util/validator');
var course = require('./routes/course');
var episodes = require('./routes/episode');
var scene = require('./routes/scene');
var auth = require('./routes/auth');
var _class = require('./routes/class');
var task = require('./routes/task');
var user = require('./routes/user');
var image = require('./routes/image');
var character = require('./routes/character');
var location = require('./routes/location');
var audio = require('./routes/audio');
var push = require('./routes/push');
var mediabank = require('./routes/mediabank');
var feedback = require('./routes/feedback');

var registerUserScheme = {
    properties: {
        first_name: {
            type: "string",
            allowEmpty: false,
            required: true
        },
        last_name: {
            type: "string",
            allowEmpty: false,
            required: true
        },
        email: {
            type: "string",
            allowEmpty: false,
            required: true
        },
        password: {
            type: "string",
            allowEmpty: false,
            required: true,
            minLength: 5,
            maxLength: 20
        },
        code: {
            type: "integer",
            allowEmpty: false,
            required: true
        }
    }
}

var loginUserScheme = {
    properties: {
        email: {
            type: "string",
            allowEmpty: false,
            required: true
        },
        password: {
            type: "string",
            allowEmpty: false,
            required: true,
            // minLength: 5,
            // maxLength: 20
        }
    }
}

var updateUserScheme = {
    properties: {
        first_name: {
            type: "string",
            allowEmpty: false,
            required: true
        },
        last_name: {
            type: "string",
            allowEmpty: false,
            required: true
        },
        email: {
            type: "string",
            allowEmpty: false,
            required: true
        },

        gender: {
            type: "string",
            allowEmpty: false,
            required: true
        },
        country: {
            type: "string",
            allowEmpty: false,
            required: true
        },
        language: {
            type: "string",
            allowEmpty: false,
            required: true
        },
        phone: {
            type: "string",
            allowEmpty: false,
            required: true
        },
        birthday: {
            type: "integer",
            allowEmpty: false,
            required: true
        }
    }
}

var saveRegistrationIdScheme = {
    properties: {
        registrationId: {
            type: "string",
            allowEmpty: false,
            required: true
        }
    }
}

var createClassScheme = {
    properties: {
        name: {
            type: "string",
            allowEmpty: false,
            required: true
        },
        desc: {
            type: "string",
            allowEmpty: false,
            required: true
        },
        currentCourse: {
            type: "string",
            allowEmpty: false,
            required: false,
            minLength: 24,
            maxLength: 24
        },
        courses: {
            type: "array",
            required: true,
            allowEmpty: true,
            items: {
                type: "string",
                maxItems: 50,
                minLength: 24,
                maxLength: 24,
            }
        },
        users: {
            type: "array",
            required: true,
            allowEmpty: true,
            items: {
                type: "string",
                maxItems: 50,
                minLength: 24,
                maxLength: 24,
            }
        },
        tutor: {
            type: 'string',
            allowEmpty: false,
            required: true,
            minLength: 24,
            maxLength: 24
        }
    }
}

var createUpdateCourseScheme = {
    properties: {
        name: {
            type: "string",
            allowEmpty: false,
            required: true
        },
        desc: {
            type: "string",
            allowEmpty: false,
            required: true
        },
        episodes: {
            type: "array",
            required: true,
            allowEmpty: true,
            items: {
                type: "string",
                maxItems: 50,
                minLength: 24,
                maxLength: 24,
            }
        }
    }
}

var createUpdateEpisodeScheme = {
    properties: {
        name: {
            type: "string",
            allowEmpty: false,
            required: true
        },
        desc: {
            type: "string",
            allowEmpty: false,
            required: true
        },
        scenes: {
            type: "array",
            required: true,
            allowEmpty: true,
            items: {
                type: "string",
                maxItems: 50,
                minLength: 24,
                maxLength: 24,
            }
        },
        image: {
            type: "string",
            allowEmpty: false,
            required: false,
            minLength: 24,
            maxLength: 24
        }
    }
}

var createUpdateSceneScheme = {
    properties: {
        name: {
            type: "string",
            allowEmpty: false,
            required: true
        },
        desc: {
            type: "string",
            allowEmpty: false,
            required: true
        },
        location: {
            type: "string",
            allowEmpty: false,
            required: true,
            minLength: 24,
            maxLength: 24
        },
        tasks: {
            type: "array",
            required: true,
            allowEmpty: true,
            items: {
                type: "string",
                maxItems: 50,
                minLength: 24,
                maxLength: 24,
            }
        },
        image: {
            type: "string",
            allowEmpty: false,
            required: false,
            minLength: 24,
            maxLength: 24
        }
    }
}

var createUpdateTaskScheme = {
    properties: {
        name: {
            type: "string",
            allowEmpty: false,
            required: true
        },
        desc: {
            type: "string",
            allowEmpty: false,
            required: true
        },
        shortInfo: {
            type: "string",
            allowEmpty: false,
            required: true
        },
        state: {
            type: "string",
            allowEmpty: false,
            required: true,
            enum: ['hidden', 'locked', 'optional', 'mandatory'],
            message: 'must be of type hidden, locked, optional, mandatory'
        },

        location: {
            type: "string",
            allowEmpty: false,
            required: false,
            minLength: 24,
            maxLength: 24
        },
        character: {
            type: "string",
            allowEmpty: false,
            required: false,
            minLength: 24,
            maxLength: 24
        },

        image: {
            type: 'string',
            allowEmpty: false,
            required: false,
            minLength: 24,
            maxLength: 24
        },

        chatType: {
            type: "string",
            allowEmpty: true,
            required: false,
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
                    _type: {
                        type: "string",
                        allowEmpty: true,
                        required: true
                    },
                    text: {
                        type: "string",
                        allowEmpty: true,
                        required: true
                    },
                    audioId: {
                        type: "string",
                        allowEmpty: false,
                        required: false,
                        minLength: 24,
                        maxLength: 24
                    },
                    answers: {
                        type: "array",
                        allowEmpty: true,
                        required: false,
                        items: {
                            type: 'string',
                            required: true,
                            allowEmpty: false
                        }
                    }
                }
            }
        },

        dueDate: {
            type: "integer",
            allowEmpty: false,
            required: false
        }
    }
}

var createUpdateCharacterScheme = {
    properties: {
        name: {
            type: "string",
            allowEmpty: false,
            required: true
        },
        desc: {
            type: "string",
            allowEmpty: false,
            required: true
        },
        image: {
            type: "string",
            allowEmpty: false,
            required: false,
            minLength: 24,
            maxLength: 24
        }
    }
}

var createUpdateLocationScheme = {
    properties: {
        name: {
            type: "string",
            allowEmpty: false,
            required: true
        },
        desc: {
            type: "string",
            allowEmpty: false,
            required: true
        },
        lon: {
            type: "Number",
            allowEmpty: false,
            required: false
        },
        lat: {
            type: "Number",
            allowEmpty: false,
            required: false
        },
        image: {
            type: "string",
            allowEmpty: false,
            required: false,
            minLength: 24,
            maxLength: 24
        }
    }
}

// var bindCharacterToTaskScheme = {
//     properties: {
//         task_id: {
//             type: "string",
//             allowEmpty: false,
//             required: true
//         },
//         character_id: {
//             type: "string",
//             allowEmpty: false,
//             required: true
//         }
//     }
// }

// var bindLocationToTaskScheme = {
//     properties: {
//         task_id: {
//             type: "string",
//             allowEmpty: false,
//             required: true
//         },
//         location_id: {
//             type: "string",
//             allowEmpty: false,
//             required: true
//         }
//     }
// }

var resetPasswordScheme = {
    properties: {
        email: {
            type: "string",
            allowEmpty: false,
            required: true
        }
    }
}

var changePasswordScheme = {
    properties: {
        email: {
            type: "string",
            allowEmpty: false,
            required: true
        },
        oldPassword: {
            type: "string",
            allowEmpty: false,
            required: true,
            minLength: 5,
            maxLength: 20
        },
        newPassword: {
            type: "string",
            allowEmpty: false,
            required: true,
            minLength: 5,
            maxLength: 20
        }
    }
}

var saveNewPasswordScheme = {
    properties: {
        token: {
            type: "string",
            allowEmpty: false,
            required: true
        },
        newPassword: {
            type: "string",
            allowEmpty: false,
            required: true,
            minLength: 5,
            maxLength: 20
        }
    }
}

var sendFeedbackUserScheme = {
    properties: {
        from: {
            type: "string",
            allowEmpty: false,
            required: true
        },
        subject: {
            type: "string",
            allowEmpty: false,
            required: true,
        },
        text: {
            type: "string",
            allowEmpty: false,
            required: true,
        }
    }
}

module.exports = {
    // image
    //getImage: image.getImage,
    //getImageById: validate({ ids: ['imageId'] }, image.getImageById),
    uploadImage: validate({ rights: ['user', 'teacher', 'admin'] }, image.uploadImage),

    // audio
    uploadAudio: validate({ rights: ['user', 'teacher', 'admin'], ids:['audioId'] },audio.uploadAudio),
    getAudio: validate({ ids:['audioId'] }, audio.getAudio),

    // auth
    register: validate({ schema: registerUserScheme }, auth.register ),
    login: validate({ schema: loginUserScheme }, auth.login ),
    logout: validate({ rights: ['user', 'teacher', 'admin'] }, auth.logout),
    resetPassword: validate({ schema: resetPasswordScheme }, auth.resetPassword),
    saveNewPassword: validate({ schema: saveNewPasswordScheme }, auth.saveNewPassword),
    checkToken: auth.resetPassword,

    // password
    changePassword: validate({ schema: changePasswordScheme, rights: ['user', 'teacher', 'admin'] }, auth.changePassword),

    // push notifications handshake
    getProjectId: validate({ rights: ['user'] }, push.getProjectId),
    saveRegistrationId: validate({
        schema: saveRegistrationIdScheme,
        rights: ['user']
    }, push.saveRegistrationId),

    sendFeedback: validate({ schema: sendFeedbackUserScheme }, feedback.sendFeedback ),

    // get info about item when push received
    getEpisode: validate({ rights: ['user', 'teacher', 'admin'], ids:['episodeId'] }, episodes.getEpisode),
    getScene: validate({ rights: ['user', 'teacher', 'admin'], ids:['sceneId'] }, scene.getScene),
    getTask: validate({ rights: ['user', 'teacher', 'admin'], ids:['taskId'] }, task.getTask),

    // classes
    getClasses: validate({ rights: ['user', 'teacher', 'admin'] }, _class.getClasses),
    getClassById: validate({ rights: ['user', 'teacher', 'admin'], ids: ['classId'] }, _class.getClassById),
    getClassUsers: validate({ rights: ['user', 'teacher', 'admin'], ids:['classId'] }, _class.getClassUsers),
    createClass: validate({
        schema: createClassScheme,
        rights: ['teacher', 'admin']
    }, _class.createClass),

    // courses
    getCourses: validate({ rights: ['user', 'teacher', 'admin'], ids:['classId'] }, course.getCourses),
    getCourseById: validate({ rights: ['user', 'teacher', 'admin'], ids:['classId', 'courseId'] }, course.getCourseById),
    createCourse: validate({
        schema: createUpdateCourseScheme,
        rights: ['teacher', 'admin'],
        ids: ['classId']
    }, course.createCourse),

    // episodes
    getEpisodes: validate({ rights: ['user', 'teacher', 'admin'], ids:['courseId'] }, episodes.getEpisodes),
    getEpisodeById: validate({ rights: ['user', 'teacher', 'admin'], ids:['courseId', 'classId'] }, episodes.getEpisodeById),
    getEpisodesAll: validate({ rights: ['user', 'teacher', 'admin'], ids:['courseId'] }, episodes.getEpisodesAll),
    createEpisode: validate({
        schema: createUpdateEpisodeScheme,
        rights: ['teacher', 'admin'],
        ids: ['courseId']
    }, episodes.createEpisode),

    // scenes
    getScenes: validate({ rights: ['user', 'teacher', 'admin'], ids: ['episodeId'] }, scene.getScenes),
    getSceneById: validate({ rights: ['user', 'teacher', 'admin'], ids: ['episodeId', 'sceneId'] }, scene.getSceneById),
    createScene: validate({
        schema: createUpdateSceneScheme,
        rights: ['teacher', 'admin'],
        ids: ['episodeId']
    }, scene.createScene),
    attachImageToScene: validate({ rights: ['teacher', 'admin'], ids: ['sceneId'] }, scene.attachImageToScene),

    // tasks
    getTasks: validate({ rights: ['user', 'teacher', 'admin'], ids: ['sceneId'] }, task.getTasks),
    getTasksForUser: validate({ rights: ['user', 'teacher', 'admin'], ids: ['sceneId'] }, task.getTasksForUser),
    getTaskById: validate({ rights: ['user', 'teacher', 'admin'], ids: ['sceneId', 'taskId'] }, task.getTaskById),

    // TODO remove teacherm user
    getTaskByIdForUser: validate({ rights: ['user', 'teacher', 'admin'], ids: ['sceneId', 'taskId'] }, task.getTaskByIdForUser),
    createTask: validate({
        schema: createUpdateTaskScheme,
        rights: ['teacher', 'admin'],
        ids: ['sceneId']
    },task.createTask),

    // characters
    getAllCharacters: validate({ rights: ['teacher', 'admin'] }, character.getAllCharacters),
    getCharacterById: validate({ rights: ['teacher', 'admin'], ids:['characterId'] }, character.getCharacterById),
    createCharacter: validate({ rights: ['teacher', 'admin'] }, character.createCharacter),
    updateCharacter: validate({ rights: ['teacher', 'admin'] }, character.updateCharacter),
    removeCharacter: validate({ rights: ['teacher', 'admin'], ids: ['characterId'] }, character.removeCharacter),

    //createCharacterForTask: validate({ rights: ['teacher', 'admin'] }, character.createCharacterForTask),
    //bindCharacterToTask: validate({
    //    schema: bindCharacterToTaskScheme,
    //    rights: ['teacher', 'admin']
    //}, character.bindCharacterToTask),

    // locations
    getAllLocations: validate({ rights: ['teacher', 'admin'] }, location.getAllLocations),
    getLocationById: validate({ rights: ['teacher', 'admin'], ids:['locationId'] }, location.getLocationById),
    updateLocation: validate({ rights: ['teacher', 'admin'], ids:['locationId'] }, location.updateLocation),
    createLocation: validate({ rights: ['teacher', 'admin'] }, location.createLocation),
    removeLocation: validate({ rights: ['teacher', 'admin'], ids: ['locationId'] }, location.removeLocation),
    //createLocationForTask: validate({ rights: ['teacher', 'admin'] }, location.createLocationForTask),
    //bindLocationToTask: validate({
    //    schema: bindLocationToTaskScheme,
    //    rights: ['teacher', 'admin']
    //}, location.bindLocationToTask),

    // user
    getLoggedUser: validate({ rights: ['user', 'teacher', 'admin'] }, user.getLoggedUser),
    getUserById: validate({ rights: ['user', 'teacher', 'admin'], ids:['userId'] }, user.getUserById),
    removeUserFromClass: validate({ rights: ['teacher'] }, user.removeUserFromClass),

    // mediabank
    getMediabank: validate({ rights: ['user', 'teacher', 'admin'] }, mediabank.getMediabank),
    getMediabankItem: validate({ ids: ['mediaId'] }, mediabank.getMediabankItem),
    createMediabankItem: validate({ rights: ['teacher', 'admin'] }, mediabank.createMediabankItem),
    updateMediabankItem: validate({ rights: ['teacher', 'admin'], ids: ['mediaId'] }, mediabank.updateMediabankItem),
    removeMediabankItem: validate({ rights: ['teacher', 'admin'], ids: ['mediaId'] }, mediabank.removeMediabankItem),

    // get images
    getImageForUser: validate({ ids: ['userId'] }, user.getImageForUser),
    getImageForEpisode: validate({ ids: ['episodeId'] }, episodes.getImageForEpisode),
    getImageForScene: validate({ ids: ['sceneId'] }, scene.getImageForScene),
    getImageForTask: validate({ ids: ['taskId'] }, task.getImageForTask),
    getImageForLocation: validate({ ids: ['locationId'] }, location.getImageForLocation),
    getImageForCharacter: validate({ ids: ['characterId'] }, character.getImageForCharacter)
};

