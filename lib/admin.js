var validate = require('./util/validator');
var user = require('./admin/user');
var _class = require('./admin/class');
var course = require('./admin/course');
var episode = require('./admin/episode');
var scene = require('./admin/scene');
var task = require('./admin/task');

var createUpdateUserScheme = {
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
        role: {
            type: "string",
            allowEmpty: false,
            required: true,
            enum: ['user', 'teacher', 'admin'],
            message: 'must be of type [user | teacher | admin]'
        },
        classes: {
            type: "array",
            required: true,
            allowEmpty: true,
            items: {
                type: "string",
                maxItems: 50,
                // uniqueItems: true
            }
        },

        gender: {
            type: "string",
            allowEmpty: false,
            required: false
        },
        country: {
            type: "string",
            allowEmpty: false,
            required: false
        },
        language: {
            type: "string",
            allowEmpty: false,
            required: false
        },
        phone: {
            type: "string",
            allowEmpty: false,
            required: false
        },
        birthday: {
            type: "integer",
            allowEmpty: false,
            required: false
        },
    }
}

var createUpdateClassScheme = {
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
                // uniqueItems: true
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
                // uniqueItems: true
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
            type: 'string',
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
            allowEmpty: true,
            required: false,
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
            type: 'string',
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
                        required: true,
                        // enum: ['TEXT', 'RECOGNITION'],
                        // message: 'must be of type TEXT or RECOGNITION'
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
            required: true
        },
        lat: {
            type: "Number",
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

module.exports = {
    // users
    getAllUsers: validate({ rights: ['admin'] }, user.getAllUsers),
    getUserById: validate({ rights: ['admin'], ids: ['userId'] }, user.getUserById),
    createUser: validate({ schema: createUpdateUserScheme, rights: ['admin'] }, user.createUser ),
    updateUser: validate({ schema: createUpdateUserScheme, rights:  ['admin'], ids: ['userId'] }, user.updateUser ),
    removeUserByAdmin: validate({ rights: ['admin'], ids: ['userId'] }, user.removeUser),

    // class
    getAllClasses: validate({ rights: ['admin'] }, _class.getAllClasses),
    getClassById: validate({ rights: ['admin'], ids: ['classId'] }, _class.getClassById),
    createClass: validate({ schema: createUpdateClassScheme, rights: ['admin'], ids: ['tutor', 'courses', 'users', 'currentCourse'] }, _class.createClass ),
    updateClass: validate({ schema: createUpdateClassScheme, rights: ['admin'], ids: ['classId'] }, _class.updateClass ),
    removeClass: validate({ rights: ['admin'], ids: ['classId'] }, _class.removeClass),

    // course
    getAllCourses: validate({ rights: ['admin'] }, course.getAllCourses),
    getCourseById: validate({ rights: ['admin'], ids: ['courseId'] }, course.getCourseById),
    createCourse: validate({ schema: createUpdateCourseScheme, rights: ['admin'], ids: ['episodes'] }, course.createCourse ),
    updateCourse: validate({ schema: createUpdateCourseScheme, rights: ['admin'], ids:['courseId', 'episodes'] }, course.updateCourse ),
    removeCourse: validate({ rights: ['admin'], ids: ['courseId'] }, course.removeCourse),

    // episode
    getAllEpisodes: validate({ rights: ['admin'] }, episode.getAllEpisodes),
    getEpisodeById: validate({ rights: ['admin'], ids: ['episodeId'] }, episode.getEpisodeById),
    createEpisode: validate({ schema: createUpdateEpisodeScheme, rights: ['admin'], ids:['scenes'] }, episode.createEpisode ),
    updateEpisode: validate({ schema: createUpdateEpisodeScheme, rights: ['admin'], ids: ['episodeId', 'scenes'] }, episode.updateEpisode ),
    removeEpisode: validate({ rights: ['admin'], ids: ['episodeId'] }, episode.removeEpisode),

    // scenes
    getAllScenes: validate({ rights: ['admin'] }, scene.getAllScenes),
    getSceneById: validate({ rights: ['admin'], ids: ['sceneId'] }, scene.getSceneById),
    createScene: validate({ schema: createUpdateSceneScheme, rights: ['admin'], ids:['tasks'] }, scene.createScene ),
    updateScene: validate({ schema: createUpdateSceneScheme, rights: ['admin'], ids: ['sceneId', 'tasks']  }, scene.updateScene ),
    removeScene: validate({ rights: ['admin'], ids: ['sceneId'] }, scene.removeScene),

    // tasks
    getAllTasks: validate({ rights: ['admin'] }, task.getAllTasks),
    getTaskById: validate({ rights: ['admin'], ids: ['taskId'] }, task.getTaskById),
    createTask: validate({ schema: createUpdateTaskScheme, rights: ['admin'] }, task.createTask ),
    updateTask: validate({ schema: createUpdateTaskScheme, rights: ['admin'], ids: ['taskId'] }, task.updateTask ),
    removeTask: validate({ rights: ['admin'], ids: ['taskId'] }, task.removeTask),

    // locations
    //getAllLocations: validate({ rights: ['admin'] }, task.getAllLocations),
    //getLocationById: validate({ rights: ['admin'], ids: ['taskId'] }, task.getLocationById),
    //createLocation: validate({ schema: createUpdateLocationScheme, rights: ['admin'] }, task.createLocation ),
    //updateLocation: validate({ schema: createUpdateLocationScheme, rights: ['admin'], ids: ['taskId'] }, task.updateLocation ),
    //removeLocation: validate({ rights: ['admin'], ids: ['taskId'] }, task.removeLocation),

    // characters
    //getAllCharacters: validate({ rights: ['admin'] }, task.getAllCharacters),
    //getCharacterById: validate({ rights: ['admin'], ids: ['taskId'] }, task.getCharacterById),
    //createCharacter: validate({ schema: createUpdateCharacterScheme, rights: ['admin'] }, task.createCharacter ),
    //updateCharacter: validate({ schema: createUpdateCharacterScheme, rights: ['admin'], ids: ['taskId'] }, task.updateCharacter ),
    //removeCharacter: validate({ rights: ['admin'], ids: ['taskId'] }, task.removeCharacter)
}
