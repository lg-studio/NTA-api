var db = require('../util/mongodb');

var User = db.model('User', {
    token: String,
    first_name: String,
    last_name: String,
    email: String,
    password: String,

    gender: String,
    country: String,
    language: String,
    registered: Number,
    phone: String,
    birthday: Number,

    classes: [ db.Schema.Types.ObjectId ], // admin don't have classes
    role: String,
    image: {
        filename: String,
        contentType: String,
        length: Number,
        buffer: Buffer,
        created: Number
    },
    deviceRegistrationId: String,

    resetPasswordToken: String,
    resetPasswordExpires: Date
});

var Class = db.model('Class', {
    name: String,
    desc: String,
    code: String,
    courses: [ db.Schema.Types.ObjectId ],
    users: [ db.Schema.Types.ObjectId ], // students
    tutor: db.Schema.Types.ObjectId,
    currentCourse: db.Schema.Types.ObjectId,
    created: Number,

    news: [{
        _type: String,  // added, created, updated, removed
        date: Number,
        object: db.Schema.Types.ObjectId,
        author: db.Schema.Types.ObjectId,
    }]
});

var Course = db.model('Course', {
    name: String,
    desc: String,
    episodes: [ db.Schema.Types.ObjectId ],
    created: Number,

    //owner: db.Schema.Types.ObjectId,
    owner: String,
    admin: Boolean
});

var Episode = db.model('Episode', {
    image: {
        filename: String,
        contentType: String,
        length: Number,
        buffer: Buffer,
        created: Number
    },
    name: String,
    desc: String,
    scenes: [ db.Schema.Types.ObjectId ],

    created: Number,
    //owner: db.Schema.Types.ObjectId,
    owner: String,
    admin: Boolean
});

var Scene = db.model('Scene', {
    image: {
        filename: String,
        contentType: String,
        length: Number,
        buffer: Buffer,
        created: Number
    },

    name: String,
    desc: String,
    location: {
        name: String,
        desc: String,
        lon: Number,
        lat: Number,
        image: {
            filename: String,
            contentType: String,
            length: Number,
            buffer: Buffer,
            created: Number
        }
    },
    tasks: [ db.Schema.Types.ObjectId ],

    created: Number,
    //owner: db.Schema.Types.ObjectId,
    owner: String,
    admin: Boolean
});

var Task = db.model('Task', {
    image: {
        filename: String,
        contentType: String,
        length: Number,
        buffer: Buffer,
        created: Number
    },
    name: String,
    desc: String,
    shortInfo: String,

    state: String, // locked/hidden/optional/mandatory
    chatType: String, // RECOGNITION | TEACHER | null
    character: {
        name: String,
        desc: String,
        image: {
            filename: String,
            contentType: String,
            length: Number,
            buffer: Buffer,
            created: Number
        }
    },
    location: {
        name: String,
        desc: String,
        lon: Number,
        lat: Number,
        image: {
            filename: String,
            contentType: String,
            length: Number,
            buffer: Buffer,
            created: Number
        }
    },

    dueDate: Number,
    chat: [ {
        _type: String, // TEXT | AUDIO
        text: String,
        audioId: db.Schema.Types.ObjectId,
        answers: [ String ]
    } ],

    created: Number,
    //owner: db.Schema.Types.ObjectId,
    owner: String,
    admin: Boolean
});

var Character = db.model('Character', {
    image: {
        name: String,
        contentType: String,
        length: Number,
        buffer: Buffer,
        created: Number
    },
    name: String,
    desc: String,

    created: Number,
    //owner: db.Schema.Types.ObjectId,
    owner: String,
    admin: Boolean
});

var Location = db.model('Location', {
    image: {
        name: String,
        contentType: String,
        length: Number,
        buffer: Buffer,
        created: Number
    },
    name: String,
    desc: String,
    lon: Number,
    lat: Number,

    created: Number,
    //owner: db.Schema.Types.ObjectId,
    owner: String,
    admin: Boolean
});

// users avatars
var Image = db.model('Image', {
    name: String,
    contentType: String,
    length: Number,
    buffer: Buffer,
    created: Number,
    owner: String,
});

// audio for tasks
var Audio = db.model('Audio', {
    name: String,
    filename: String,
    contentType: String,
    length: Number,
    buffer: Buffer,
    created: Number,
    owner: String,
    uploaded: Boolean
});

// images for content
var Mediabank = db.model('Mediabank', {
    name: String,
    contentType: String,
    length: Number,
    buffer: Buffer,
    created: Number,
    owner: String,
});

var Tasklog = db.model('Tasklog', {
    user: db.Schema.Types.ObjectId, // who completed the task

    tasks: [ {
        taskId: db.Schema.Types.ObjectId,
        taskName: String,
        chatType: String, // TEXT or recognition
        done: Number, // timestamp when task was done
        result: Number,

        chat: [{
            text: String,
            answer: String,
            audioResponseId: db.Schema.Types.ObjectId,
            result: Number,
            tries: Number
        }]
    } ]
})

module.exports = {
    User: User,
    Class: Class,
    Course: Course,
    Episode: Episode,
    Scene: Scene,
    Task: Task,
    Character: Character,
    Location: Location,
    Image: Image,
    Audio: Audio,
    Mediabank: Mediabank,
    
    // task stats
    Tasklog: Tasklog,
};
