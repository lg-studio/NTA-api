var Schema = require('../../lib/database/models');
var _ = require('underscore');
var async = require('async');
var fs = require('fs');
var bcrypt = require('bcryptjs');

function getPassword(pwd) {
    var salt = bcrypt.genSaltSync(process.env.PWD_SALT || 8);
    return bcrypt.hashSync(pwd, salt);
}

function readFile(path) {
    if(!path) throw 'Path should not be empty!';

    var res = fs.readFileSync(__dirname + path);
    if(!res) throw 'Image not exists';
    return res;
}

var func = [];

function add(o) {
    func.push( (next) => {
        o.save( (e, r) => { 
            if(e) console.error('Error: ', e);
            next();
        })
    });
    return o;
}

var defaultImageFile = readFile('/images/default.png');
var defaultImage = {
    name: 'default',
    contentType: 'image/png',
    length: defaultImageFile.length,
    buffer: defaultImageFile
}

// super admin
var TestAdmin = add(new Schema.User({
    first_name: 'Test',
    last_name: 'Test',
    email: 'o.chaplya@usinformatic.com',
    // password: 'Test',
    password: getPassword('12345'),
    token: 'test',
    role: 'admin',
    image: defaultImage,

    gender: 'Male',
    country: 'USA',
    language: 'English',
    registered: Date.now(),
    phone: '+0 000 12345678',
    birthday: Date.now() - 36000
}));

var defaultImageFile = readFile('/images/default.png');
var defaultImage = {
    name: 'default',
    contentType: 'image/png',
    length: defaultImageFile.length,
    buffer: defaultImageFile
}

// super admin
var superAdmin = add(new Schema.User({
    first_name: 'Super',
    last_name: 'Admin',
    email: 'admin@ex.com',
    // password: 'admin',
    password: getPassword('12345'),
    token: '5571a7f5-0aeb-43cf-8e0b-4636bba7cbf6',
    role: 'admin',
    image: defaultImage,

    gender: 'Male',
    country: 'USA',
    language: 'English',
    registered: Date.now(),
    phone: '+0 000 12345678',
    birthday: Date.now() - 36000
}));

var secAdmin = add(new Schema.User({
    first_name: 'Second',
    last_name: 'Admin',
    email: 'secadmin@ex.com',
    // password: 'admin',
    password: getPassword('12345'),
    token: '1171a7f5-0aeb-43cf-8e0b-4636bba73212',
    role: 'admin',
    image: defaultImage,

    gender: 'Male',
    country: 'USA',
    language: 'English',
    registered: Date.now(),
    phone: '+0 000 12345678',
    birthday: Date.now() - 36000,
}));

// users
var testTeacher = add(new Schema.User({
    first_name: 'Test',
    last_name: 'Teacher',
    email: 'testteacher@ex.com',
    // password: '12345',
    password: getPassword('12345'),
    token: '5a1d07e5-ec0c-4041-b2b9-f1f238caa952',
    classes: [],
    role: 'teacher',
    image: defaultImage,

    gender: 'Male',
    country: 'Japan',
    language: 'Japanese',
    registered: Date.now(),
    phone: '+0 000 12345678',
    birthday: Date.now() - 36000,
}));

// users
var myTeacher = add(new Schema.User({
    first_name: 'My',
    last_name: 'Teacher',
    email: 'my@ex.com',
    // password: '12345',
    password: getPassword('12345'),
    token: '3ded76dd-7b0b-4e60-b2c2-a3e4ff10a530',
    classes: [],
    role: 'teacher',
    image: defaultImage,

    gender: 'Female',
    country: 'Germany',
    language: 'German',
    registered: Date.now(),
    phone: '+0 000 12345678',
    birthday: Date.now() - 36000,
}));

var teacher2 = add(new Schema.User({
    first_name: 'Volodia',
    last_name: 'The Teacher',
    email: 'voteach@ex.com',
    // password: '12345',
    password: getPassword('12345'),
    token: 'fcaa3b14-8e25-4ac8-b27a-814548b0e2bc',
    classes: [],
    role: 'teacher',
    image: defaultImage,

    gender: 'Male',
    country: 'Ukraine',
    language: 'Ukrainian',
    registered: Date.now(),
    phone: '+0 000 12345678',
    birthday: Date.now() - 36000,
}));

var johnDoe = add(new Schema.User({
    first_name: 'John',
    last_name: 'Doe',
    email: 'john@ex.com',
    // password: 'john',
    password: getPassword('12345'),
    token: '42f60264-1dc9-459a-a34f-310be4de14c5',
    classes: [],
    role: 'teacher',
    image: defaultImage,

    gender: 'Male',
    country: 'Island',
    language: 'Islandic',
    registered: Date.now(),
    phone: '+0 000 12345678',
    birthday: Date.now() - 36000,
}));

var janeDoe = add(new Schema.User({
    first_name: 'Jane',
    last_name: 'Doe',
    email: 'jane@ex.com',
    // password: 'jane',
    password: getPassword('12345'),
    token: '14382acd-53c1-4389-bb5a-afec18111606',
    classes: [],
    role: 'user',
    image: defaultImage,

    gender: 'Female',
    country: 'Korea',
    language: 'Korean',
    registered: Date.now(),
    phone: '+0 000 12345678',
    birthday: Date.now() - 36000,
}));

var bobDoe = add(new Schema.User({
    first_name: 'Bob',
    last_name: 'Doe',
    email: 'bob@ex.com',
    // password: 'bob',
    password: getPassword('12345'),
    token: '68bd6ab2-d8ba-4f09-a1df-47461e48518e',
    classes: [],
    role: 'user',
    image: defaultImage,

    gender: 'Male',
    country: 'Nederlands',
    language: 'Nederlands',
    registered: Date.now(),
    phone: '+0 000 12345678',
    birthday: Date.now() - 36000,
}));

var fedirKlymenko = add(new Schema.User({
    first_name: 'Fedir',
    last_name: 'Klymenko',
    email: 'fedir@ex.com',
    // password: '12345',
    password: getPassword('12345'),
    token: 'e5fd8f55-de59-4f8c-ac06-089464954bc9',
    classes: [],
    role: 'user',
    image: defaultImage,

    gender: 'Male',
    country: 'Ukraine',
    language: 'Ukrainian',
    registered: Date.now(),
    phone: '+0 000 12345678',
    birthday: Date.now() - 36000,
}));

var dimaRadchenko = add(new Schema.User({
    first_name: 'Dima',
    last_name: 'Rad',
    email: 'dima@ex.com',
    // password: '12345',
    password: getPassword('12345'),
    token: 'd15fb301-7b89-4bea-a63e-a33d24d53ea8',
    classes: [],
    role: 'user',
    image: defaultImage,

    gender: 'Male',
    country: 'Ukraine',
    language: 'Ukrainian',
    registered: Date.now(),
    phone: '+0 000 12345678',
    birthday: Date.now() - 36000,
}));

var sviatoslavTesliak = add(new Schema.User({
    first_name: 'Sviatoslav',
    last_name: 'Tesliak',
    email: 'sviatoslav@ex.com',
    // password: '12345',
    password: getPassword('12345'),
    token: '9e001fee-0021-47d1-ae21-e3f66bd4b03d',
    classes: [],
    role: 'user',
    image: defaultImage,

    gender: 'Male',
    country: 'Ukraine',
    language: 'Ukrainian',
    registered: Date.now(),
    phone: '+0 000 12345678',
    birthday: Date.now() - 36000,
}));

var janAdmin = add(new Schema.User({
    first_name: 'Jan',
    last_name: 'Admin',
    email: 'janadmin@ex.com',
    // password: '12345',
    password: getPassword('12345'),
    token: '3636042e-ebe7-4661-8c48-d6190879a020',
    classes: [],
    role: 'admin',
    image: defaultImage,

    gender: 'Male',
    country: 'Germany',
    language: 'German',
    registered: Date.now(),
    phone: '+0 000 12345678',
    birthday: Date.now() - 36000,
}));

var janTutor = add(new Schema.User({
    first_name: 'Jan',
    last_name: 'Tutor',
    email: 'jantutor@ex.com',
    // password: '12345',
    password: getPassword('12345'),
    token: '8597c375-4324-4e52-aee2-69f031be4647',
    classes: [],
    role: 'teacher',
    image: defaultImage,

    gender: 'Male',
    country: 'Germany',
    language: 'German',
    registered: Date.now(),
    phone: '+0 000 12345678',
    birthday: Date.now() - 36000,
}));

var janUser = add(new Schema.User({
    first_name: 'Jan',
    last_name: 'User',
    email: 'januser@ex.com',
    // password: '12345',
    password: getPassword('12345'),
    token: 'ef16ae88-b6eb-4ab0-9cf1-8947cb2a08f7',
    classes: [],
    role: 'user',
    image: defaultImage,

    gender: 'Male',
    country: 'Germany',
    language: 'German',
    registered: Date.now(),
    phone: '+0 000 12345678',
    birthday: Date.now() - 36000,
}));

var philipAdmin = add(new Schema.User({
    first_name: 'Philip',
    last_name: 'Admin',
    email: 'philipadmin@ex.com',
    // password: '12345',
    password: getPassword('12345'),
    token: '72343532-83a1-497b-a7d9-ab8a33278324',
    classes: [],
    role: 'admin',
    image: defaultImage,

    gender: 'Male',
    country: 'Germany',
    language: 'German',
    registered: Date.now(),
    phone: '+0 000 12345678',
    birthday: Date.now() - 36000,
}));

var philipTutor = add(new Schema.User({
    first_name: 'Philip',
    last_name: 'Tutor',
    email: 'philiptutor@ex.com',
    // password: '12345',
    password: getPassword('12345'),
    token: '0fb9de14-3635-4911-af3c-229261b5965c',
    classes: [],
    role: 'teacher',
    image: defaultImage,

    gender: 'Male',
    country: 'Germany',
    language: 'German',
    registered: Date.now(),
    phone: '+0 000 12345678',
    birthday: Date.now() - 36000,
}));

var philipUser = add(new Schema.User({
    first_name: 'Philip',
    last_name: 'User',
    email: 'philipuser@ex.com',
    // password: '12345',
    password: getPassword('12345'),
    token: '0d63594a-bf05-4f84-8703-eebc7f5ee154',
    classes: [],
    role: 'user',
    image: defaultImage,

    gender: 'Male',
    country: 'Germany',
    language: 'German',
    registered: Date.now(),
    phone: '+0 000 12345678',
    birthday: Date.now() - 36000,
}));

// Officer Roger Murtaugh
var crmImageFile = fs.readFileSync(__dirname + '/images/crm.png');
var crmImage = add(new Schema.Mediabank({
    name: 'default',
    contentType: 'image/png',
    length: crmImageFile.length,
    buffer: crmImageFile,
    created: Date.now(),
    owner: 'admin'
}));

var crmCharacter = add(new Schema.Character({
    name: 'Officer Roger Murtaugh',
    desc: 'Officer Murtaugh, 51, lives in New Jersey and has worked for CBP for 22 years. He has a lot of experience and takes his job very seriously.',
    image: {
        name: 'default',
        contentType: 'image/png',
        length: crmImageFile.length,
        buffer: crmImageFile,
        created: Date.now(),
    },

    created: Date.now(),
    owner: 'admin'
}));

// James O'Neil
var jamesOneilImageFile = fs.readFileSync(__dirname + '/images/ojoneilImage.png');
var jamesOneilImage = add(new Schema.Mediabank({
    name: 'default',
    contentType: 'image/png',
    length: jamesOneilImageFile.length,
    buffer: jamesOneilImageFile,
    created: Date.now(),
    owner: 'admin'
}));

var jamesOneilCharacter = add(new Schema.Character({
    name: 'Officer James O’Neil',
    desc: 'Officer O’Neil, 26, lives in Manhattan and works at the airport to earn some money for his college fees. He is a friendly young man and likes to help people.',
    image: {
        name: 'default',
        contentType: 'image/png',
        length: jamesOneilImageFile.length,
        buffer: jamesOneilImageFile,
        created: Date.now(),
    },

    created: Date.now(),
    owner: 'admin'
}));

// Mrs. Jessica Thorm
var jessicaThornImageFile = fs.readFileSync(__dirname + '/images/jessicaThorn.png');
var jessicaThornImage = add(new Schema.Mediabank({
    name: 'default',
    contentType: 'image/png',
    length: jessicaThornImageFile.length,
    buffer: jessicaThornImageFile,
    created: Date.now(),
    owner: 'admin'
}));

var jessicaThornCharacter = add(new Schema.Character({
    name: 'Mrs. Jessica Thorn',
    desc: 'Mrs. Thorn, 32, works at the information point since 8 years. She loves to help travellers find their way and tells them more about the city.',
    image: {
        name: 'default',
        contentType: 'image/png',
        length: jessicaThornImageFile.length,
        buffer: jessicaThornImageFile,
        created: Date.now()
    },

    created: Date.now(),
    owner: 'admin'
}));

// Alex Thatcher
var alexThatcherImageFile = fs.readFileSync(__dirname + '/images/alexTatcher.png');
var alexThatcherImage = add(new Schema.Mediabank({
    name: 'default',
    contentType: 'image/png',
    length: alexThatcherImageFile.length,
    buffer: alexThatcherImageFile,
    created: Date.now(),
    owner: 'admin'
}));

var alexThatcherCharacter = add(new Schema.Character({
    name: 'Bus driver Alex Thatcher',
    desc: 'Mr. Thatcher has been a bus driver all his life. He loves getting in contact with the tourists. This is why he started to work for the JFK Shuttle Service. He is from Ohio but moved to NYC because he likes the big city life.',
    image: {
        name: 'default',
        contentType: 'image/png',
        length: alexThatcherImageFile.length,
        buffer: alexThatcherImageFile,
        created: Date.now(),
    },

    created: Date.now(),
    owner: 'admin'
}));

// Shiloh
var shilohImageFile = fs.readFileSync(__dirname + '/images/shiloh.png');
var shilohImage = add(new Schema.Mediabank({
    name: 'default',
    contentType: 'image/png',
    length: shilohImageFile.length,
    buffer: shilohImageFile,
    created: Date.now(),
    owner: 'admin'
}));

var shilohCharacter = add(new Schema.Character({
    name: 'Women on the bus: Shiloh Witherspoon',
    desc: 'Shiloh is a true New York girl. She just turned 24 and lived here all her live. She just returned from visiting her grandparents in Seattle.',
    image: {
        name: 'default',
        contentType: 'image/png',
        length: shilohImageFile.length,
        buffer: shilohImageFile,
        created: Date.now(),
    },

    created: Date.now(),
    owner: 'admin'
}));

// Jayden Thompson
var jaydenImageFile = fs.readFileSync(__dirname + '/images/jayden.png');
var jaydenImage = add(new Schema.Mediabank({
    name: 'default',
    contentType: 'image/png',
    length: jaydenImageFile.length,
    buffer: jaydenImageFile,
    created: Date.now(),
    owner: 'admin'
}));

var jaydenCharacter = add(new Schema.Character({
    name: 'a by-passing pedestrian in the centre of Brooklyn',
    desc: 'Jayden Norris (25) attends Brooklyn College and studies Music.',
    image: {
        name: 'default',
        contentType: 'image/png',
        length: jaydenImageFile.length,
        buffer: jaydenImageFile,
        created: Date.now(),
    },

    created: Date.now(),
    owner: 'admin'
}));

// Michelle Thompson
var michelleImageFile = fs.readFileSync(__dirname + '/images/michelle.png');
var michelleImage = add(new Schema.Mediabank({
    name: 'default',
    contentType: 'image/png',
    length: michelleImageFile.length,
    buffer: michelleImageFile,
    created: Date.now(),
    owner: 'admin'
}));

var michelleCharacter = add(new Schema.Character({
    name: 'a german waitress working in a coffee shop',
    desc: 'Michelle Thompson is a german exchange stundent who  just recently started to work in the coffee shop. She is open minded and likes being among people. She is a reliable and polite waitress who enjoys her new job.',
    image: {
        name: 'default',
        contentType: 'image/png',
        length: michelleImageFile.length,
        buffer: michelleImageFile,
        created: Date.now(),
    },

    created: Date.now(),
    owner: 'admin'
}));

// John Parker
var parkerImageFile = fs.readFileSync(__dirname + '/images/parker.png');
var parkerImage = add(new Schema.Mediabank({
    name: 'default',
    contentType: 'image/png',
    length: parkerImageFile.length,
    buffer: parkerImageFile,
    created: Date.now(),
    owner: 'admin'
}));

var parkerCharacter = add(new Schema.Character({
    name: 'John Parker',
    desc: 'If you have any questions considering precious tipps all about the various tourist attractions NCY offers- ask John Parker! He has never lived anywhere else than in Brooklyn and will have valuable recommendations for you.',
    image: {
        name: 'default',
        contentType: 'image/png',
        length: parkerImageFile.length,
        buffer: parkerImageFile,
        created: Date.now(),
    },

    created: Date.now(),
    owner: 'admin'
}));

// JFK International Airport
var jfkImageFile = fs.readFileSync(__dirname + '/images/jfk.png');
var jfkImage = add(new Schema.Mediabank({
    name: 'default',
    contentType: 'image/png',
    length: jfkImageFile.length,
    buffer: jfkImageFile,
    created: Date.now(),
    owner: 'admin'
}));

var jfkLocation = add(new Schema.Location({
    name: 'JFK International Airport',
    desc: 'This is John F. Kennedy International Airport. It is the busiest international airport in the United States with more than 53 Million passengers a year.',
    lon: 40.6397,
    lat: 73.7789,
    image: {
        name: 'airport',
        contentType: 'image/png',
        length: jfkImageFile.length,
        buffer: jfkImageFile,
        created: Date.now(),
    },

    created: Date.now(),
    owner: 'admin'
}));

// On The Bus
//var onTheBusImageFile = fs.readFileSync(__dirname + '/images/onTheBus.png');
//var onTheBusImage = add(new Schema.Mediabank({
//    name: 'default',
//    contentType: 'image/png',
//    length: onTheBusImageFile.length,
//    buffer: onTheBusImageFile,
//    created: Date.now(),
//    owner: 'admin
//}));

var onTheBusLocation = add(new Schema.Location({
    name: 'On the Bus',
    desc: 'JFK and NYC are connected by a shuttle bus service. Travelers can use the bus for a small fee to reach the city. The driving time depends on the traffic conditions.',
    //lon: 40.6397,
    //lat: 73.7789,
    //image: {
    //    name: 'default',
    //    contentType: 'image/png',
    //    length: onTheBusImageFile.length,
    //    buffer: onTheBusImageFile,
    //    created: Date.now(),
    //},

    created: Date.now(),
    owner: 'admin'
}));

// Bus Station
//var busStationImageFile = fs.readFileSync(__dirname + '/images/busStation.png');
//var busStationImage = add(new Schema.Mediabank({
//    name: 'default',
//    contentType: 'image/png',
//    length: busStationImageFile.length,
//    buffer: busStationImageFile,
//    created: Date.now(),
//    owner: 'admin
//}));

var busStationLocation = add(new Schema.Location({
    name: 'Bus Station',
    desc: 'Bus Station',
    //lon: 40.6397,
    //lat: 73.7789,
    //image: {
    //    name: 'default',
    //    contentType: 'image/png',
    //    length: onTheBusImageFile.length,
    //    buffer: onTheBusImageFile,
    //    created: Date.now(),
    //},

    created: Date.now(),
    owner: 'admin'
}));

// In The centre of Brooklyn
var brooklynImageFile = fs.readFileSync(__dirname + '/images/brooklyn.png');
var brooklynImage = add(new Schema.Mediabank({
    name: 'default',
    contentType: 'image/png',
    length: brooklynImageFile.length,
    buffer: brooklynImageFile,
    created: Date.now(),
    owner: 'admin'
}));

var brooklynLocation = add(new Schema.Location({
    name: 'In The centre of Brooklyn',
    desc: 'In The centre of Brooklyn',
    lon: 40.6928,
    lat: 73.9903,
    image: {
        name: 'default',
        contentType: 'image/png',
        length: brooklynImageFile.length,
        buffer: brooklynImageFile,
        created: Date.now()
    },

    created: Date.now(),
    owner: 'admin'
}));

// In The coffeeshop
//var coffeeshopImageFile = fs.readFileSync(__dirname + '/images/coffeeshop.png');
//var coffeeshopImage = add(new Schema.Mediabank({
//    name: 'default',
//    contentType: 'image/png',
//    length: coffeeshopImageFile.length,
//    buffer: coffeeshopImageFile,
//    created: Date.now(),
//    owner: 'admin
//}));

var coffeeshopLocation = add(new Schema.Location({
    name: 'Harley Street apartment',
    desc: 'New Yorkers love coffee which is why you find coffee shops all over the place. Customers are offered a variety of hot drinks and tasty bites.',
    //lon: 51.5184777,
    //lat: -0.147274,
    //image: {
    //    name: 'default',
    //    contentType: 'image/png',
    //    length: coffeeshopImage.length,
    //    buffer: brooklynImage,
    //    created: Date.now()
    //},

    created: Date.now(),
    owner: 'admin'
}));

// tasks
var task1ImageFile = fs.readFileSync(__dirname + '/images/task1.png');
var task1Image = add(new Schema.Mediabank({
    name: 'default',
    contentType: 'image/png',
    length: task1ImageFile.length,
    buffer: task1ImageFile,
    created: Date.now(),
    owner: 'admin'
}));

var task1 = add(new Schema.Task({
    image: {
        name: 'default',
        contentType: 'image/png',
        length: task1ImageFile.length,
        buffer: task1ImageFile,
        created: Date.now(),
    },
    name: 'Talk to the CBP Officer',
    desc: 'Talk to the Customs and Border Protection Officer. They will ask you where you are from and what you will do in the United States. You may also eavesdrop to the people in line before you, so you get an idea, what’s coming at you.',
    shortInfo: 'Tell the CBP Officer who you are and what you intend to do.',

    dueDate: Date.now(),
    character: {
        name: 'Officer Roger Murtaugh',
        desc: 'Officer Murtaugh, 51, lives in New Jersey and has worked for CBP for 22 years. He has a lot of experience and takes his job very seriously.',
        image: {
            name: 'default',
            contentType: 'image/png',
            length: crmImageFile.length,
            buffer: crmImageFile,
            created: Date.now(),
        },
    },
    location: {
        name: 'JFK International Airport',
        desc: 'This is John F. Kennedy International Airport. It is the busiest international airport in the United States with more than 53 Million passengers a year.',
        lon: 40.6397,
        lat: 73.7789,
        image: {
            name: 'airport',
            contentType: 'image/png',
            length: jfkImageFile.length,
            buffer: jfkImageFile,
            created: Date.now(),
        },
    },
    owner: 'admin',
    state: 'mandatory',
    chat: [ {
        _type: 'TEXT', // TEXT | AUDIO
        text: ' Welcome to NYC. Can I see your passport please? I need to take a picture and your fingerprints. What’s the purpose of your stay?',
        answers: [ 'I want to do an internship here.', 'I’m here for a business trip.' ]
    }, {
        _type: 'TEXT', // TEXT | AUDIO
        text: 'Where will you stay?',
        answers: [ 'I will live in an apartment in Manhattan.', 'I will stay at the Hilton Hotel.' ]
    }, {
        _type: 'TEXT', // TEXT | AUDIO
        text: 'How long will you stay here?',
        answers: [ 'As long as I find work.', 'I haven’t planned my return, yet.' ]
    }, {
        _type: 'TEXT', // TEXT | AUDIO
        text: 'Do you have anything to declare?',
        answers: [ 'No, I haven’t.', 'Yes, three bottles of Whiskey.' ]
    }, {
        _type: 'TEXT', // TEXT | AUDIO
        text: 'Alright! Enjoy your stay. The baggage claim is to the right.'
    }]
}));

// task 2
var task2ImageFile = fs.readFileSync(__dirname + '/images/task2.png');
var task2Image = add(new Schema.Mediabank({
    name: 'default',
    contentType: 'image/png',
    length: task2ImageFile.length,
    buffer: task2ImageFile,
    created: Date.now(),
    owner: 'admin'
}));

var task2 = add(new Schema.Task({
    owner: 'admin',
    image: {
        name: 'default',
        contentType: 'image/png',
        length: task2ImageFile.length,
        buffer: task2ImageFile,
        created: Date.now(),
    },
    name: 'Lost Baggage',
    shortInfo: 'Your baggage is lost and you have to talk to an officer.',
    desc: 'After waiting for all the baggage to be on the caroussel you realize, that your suitcase isn’t there. You have to tell an Officer about your missing items and give them your address.',
    dueDate: Date.now(),
    state: 'mandatory',

    character: {
        name: 'Officer James O’Neil',
        desc: 'Officer O’Neil, 26, lives in Manhattan and works at the airport to earn some money for his college fees. He is a friendly young man and likes to help people.',
        image: {
            name: 'default',
            contentType: 'image/png',
            length: jamesOneilImageFile.length,
            buffer: jamesOneilImageFile,
            created: Date.now(),
        },
    },
    location: {
        name: 'JFK International Airport',
        desc: 'This is John F. Kennedy International Airport. It is the busiest international airport in the United States with more than 53 Million passengers a year.',
        lon: 40.6397,
        lat: 73.7789,
        image: {
            name: 'airport',
            contentType: 'image/png',
            length: jfkImageFile.length,
            buffer: jfkImageFile,
            created: Date.now(),
        },
    },
    chat: [ {
        _type: 'TEXT', // TEXT | AUDIO
        text: 'Good morning! How can I help you?',
        answers: [ 'I’m missing my suitcase.', 'My dog has run away.' ]
    }, {
        _type: 'TEXT', // TEXT | AUDIO
        text: 'I’m sorry to hear that! We will do everything to find your personal items and bring them to you, as soon as they have been found!. Can you please give me your address?',
        answers: [ 'I live on 400 W 55th St,  New York, NY 10019', 'I will sleep at Burger King.' ]
    }, {
        _type: 'TEXT', // TEXT | AUDIO
        text: 'And can you give me your telephone number or an email where we can contact you if necessary?',
        answers: [ '+1 212-405-97683', 'Love.Traveling@gmail.com' ]
    }, {
        _type: 'TEXT', // TEXT | AUDIO
        text: 'Can you please describe your missing suitcase as detailed as possible?',
        answers: [ 'It is a green hard shell suitcase with different stickers stuck to it.', 'It’s a yellow bag with a rainbow colored ribbon tied to it.' ]
    }, {
        _type: 'TEXT', // TEXT | AUDIO
        text: 'Thanks! We will deliver the suitcase to you as soon as we find it. Here is our business card. Feel free to call us if you have any further questions.',
    }]
}));

// task 3
var task3ImageFile = fs.readFileSync(__dirname + '/images/task3.png');
var task3Image = add(new Schema.Mediabank({
    name: 'default',
    contentType: 'image/png',
    length: task3ImageFile.length,
    buffer: task3ImageFile,
    created: Date.now(),
    owner: 'admin'
}));

var task3 = add(new Schema.Task({
    image: {
        name: 'default',
        contentType: 'image/png',
        length: task3ImageFile.length,
        buffer: task3ImageFile,
        created: Date.now(),
    },
    owner: 'admin',
    state: 'mandatory',

    name: 'Finding the shuttle service',
    desc: 'In Brooklyn you will see your apartment and meet your future roommates for the first time. Find out how best to get to your aparatment.',
    shortInfo: 'You commute from JFK International Airport to Brooklyn.',
    dueDate: Date.now(),
    character: {
        name: 'Mrs. Jessica Thorn',
        desc: 'Mrs. Thorn, 32, works at the information point since 8 years. She loves to help travellers find their way and tells them more about the city.',
        image: {
            name: 'default',
            contentType: 'image/png',
            length: jessicaThornImageFile.length,
            buffer: jessicaThornImageFile,
            created: Date.now()
        },
    },
    location: {
        name: 'JFK International Airport',
        desc: 'This is John F. Kennedy International Airport. It is the busiest international airport in the United States with more than 53 Million passengers a year.',
        lon: 40.6397,
        lat: 73.7789,
        image: {
            name: 'airport',
            contentType: 'image/png',
            length: jfkImageFile.length,
            buffer: jfkImageFile,
            created: Date.now(),
        },
    },
    chat: [ {
        _type: 'TEXT', // TEXT | AUDIO
        text: 'Hello! How can I be of help?',
        answers: [ 'What is the fastest way to Brooklyn?', 'Where are the restrooms?' ]
    }, {
        _type: 'TEXT', // TEXT | AUDIO
        text: 'The fastest way to Brooklyn would be the train, but it is expensive and doesn’t run as frequently as the shuttle. The shuttle can be problematic with a lot of traffic though. But still I recommend taking the shuttle!',
        answers: [ 'Where do I find the shuttle?', 'Can you sell me a ticket for the shuttle?' ]
    }, {
        _type: 'TEXT', // TEXT | AUDIO
        text: 'Just go down this hallway and turn left. You will find signs pointing to the shuttle service. Buy a ticket at the bus drivers cabin.',
        answers: [ '+1 212-405-97683', 'Love.Traveling@gmail.com' ]
    }]
}));

// scene 2
// task 4
var task4ImageFile = fs.readFileSync(__dirname + '/images/task4.png');
var task4Image = add(new Schema.Mediabank({
    name: 'default',
    contentType: 'image/png',
    length: task4ImageFile.length,
    buffer: task4ImageFile,
    created: Date.now(),
    owner: 'admin'
}));

var task4 = add(new Schema.Task({
    image: {
        name: 'default',
        contentType: 'image/png',
        length: task4ImageFile.length,
        buffer: task4ImageFile,
        created: Date.now(),
    },
    owner: 'admin',
    state: 'mandatory',

    name: 'Buy a ticket',
    desc: 'In order to take the shuttle you need a ticket.Talk to the bus driver to buy your ticket to Brooklynn.',
    shortInfo: 'You have to buy a ticket for the shuttle bus.',
    dueDate: Date.now(),

    character: {
        name: 'Bus driver Alex Thatcher',
        desc: 'Mr. Thatcher has been a bus driver all his life. He loves getting in contact with the tourists. This is why he started to work for the JFK Shuttle Service. He is from Ohio but moved to NYC because he likes the big city life.',
        image: {
            name: 'default',
            contentType: 'image/png',
            length: alexThatcherImageFile.length,
            buffer: alexThatcherImageFile,
            created: Date.now(),
        },
    },
    location: {
        name: 'On the Bus',
        desc: 'JFK and NYC are connected by a shuttle bus service. Travelers can use the bus for a small fee to reach the city. The driving time depends on the traffic conditions.',
    },

    chat: [ {
        _type: 'TEXT', // TEXT | AUDIO
        text: 'Good morning!',
        answers: [ 'Good Morning! I would like to buy a ticket.', 'Hello. Can I use this shuttle for free?' ]
    }, {
        _type: 'TEXT', // TEXT | AUDIO
        text: 'This is the shuttle to Brooklynn! A ticket costs $15. I can give you one if you have the amount with you.',
        answers: [ 'Thank you! Here you are.', 'This is expensive! But okay, it is the only way for me. Here you are.' ]
    }, {
        _type: 'TEXT', // TEXT | AUDIO
        text: 'Here is your ticket! Enjoy your stay.',
    }]
}));

// task 5
var task5ImageFile = fs.readFileSync(__dirname + '/images/task5.png');
var task5Image = add(new Schema.Mediabank({
    name: 'default',
    contentType: 'image/png',
    length: task5ImageFile.length,
    buffer: task5ImageFile,
    created: Date.now(),
    owner: 'admin'
}));

var task5 = add(new Schema.Task({
    owner: 'admin',
    image: {
        name: 'default',
        contentType: 'image/png',
        length: task5ImageFile.length,
        buffer: task5ImageFile,
        created: Date.now(),
    },
    state: 'mandatory',
    name: 'Traffic',
    desc: 'There is a traffic jam causing the bus to stop. You are getting nervous that you won’t make it on time to the city to meet your new room mates. Talk to a stranger about your fears.',
    dueDate: Date.now(),
    shortInfo: 'Talk to a stranger about the traffic jam.',
    character: {
        name: 'Women on the bus: Shiloh Witherspoon',
        desc: 'Shiloh is a true New York girl. She just turned 24 and lived here all her live. She just returned from visiting her grandparents in Seattle.',
        image: {
            name: 'default',
            contentType: 'image/png',
            length: shilohImageFile.length,
            buffer: shilohImageFile,
            created: Date.now(),
        },
    },
    location: {
        name: 'Bus Station',
        desc: 'Bus Station',
    },
    chat: [ {
        _type: 'TEXT', // TEXT | AUDIO
        text: 'You look worried. What’s the matter?',
        answers: [ 'I have to get to Brooklynn. This traffic jam makes me late to meet my new roommates!', 'I just don’t like traffic jams.' ]
    }, {
        _type: 'TEXT', // TEXT | AUDIO
        text: 'I’m sorry to hear that. Are you new to New York?',
        answers: [ 'Yes! I just arrived this morning. ', 'No, I’ve lived here my whole life.' ]
    }, {
        _type: 'TEXT', // TEXT | AUDIO
        text: 'What are you going to do here?',
        answers: [ 'I want to live here and do an internship.', 'I’m going to study arts' ]
    }, {
        _type: 'TEXT', // TEXT | AUDIO
        text: 'An internship? How exciting! Where will you stay?',
        answers: [ 'I will live with four other persons in a flat in Brooklyn.', 'I don’t know. Maybe under a bridge?' ]
    }, {
        _type: 'TEXT', // TEXT | AUDIO
        text: 'Brooklyn, hum? Let me give you an advice, since we almost reached Brooklynn. The fastest way from the shuttle station to your new appartment will be by Taxi! Tell them where you need to go and they will bring you there for only a small fee. I wish you a good start here in NYC! Maybe we will meet again!',
    }]
}));

// task 6
//var task6ImageFile = fs.readFileSync(__dirname + '/images/task6.png');
//var task6Image = add(new Schema.Mediabank({
//    name: 'default',
//    contentType: 'image/png',
//    length: task6ImageFile.length,
//    buffer: task6ImageFile,
//    created: Date.now(),
//    owner: 'admin
//}));

var task6 = add(new Schema.Task({
    owner: 'admin',
    name: 'Finding Your Appartment',
    desc: 'There is a traffic jam causing the bus to stop. You are getting nervous that you won’t make it on time to the city to meet your new room mates. Talk to a stranger about your fears.',
    dueDate: Date.now(),
    state: 'mandatory',
    shortInfo: 'Talk to a stranger about the traffic jam.',

    character: {
        name: 'a by-passing pedestrian in the centre of Brooklyn',
        desc: 'Jayden Norris (25) attends Brooklyn College and studies Music.',
        image: {
            name: 'default',
            contentType: 'image/png',
            length: jaydenImageFile.length,
            buffer: jaydenImageFile,
            created: Date.now(),
        },
    },
    location: {
        name: 'In The centre of Brooklyn',
        desc: 'In The centre of Brooklyn',
        lon: 40.6928,
        lat: 73.9903,
        image: {
            name: 'default',
            contentType: 'image/png',
            length: brooklynImageFile.length,
            buffer: brooklynImageFile,
            created: Date.now()
        },
    },
    chat: [ {
        _type: 'TEXT', // TEXT | AUDIO
        text: 'You look worried. What’s the matter?',
        answers: [ 'I have to get to Brooklynn. This traffic jam makes me late to meet my new roommates!', 'I just don’t like traffic jams.' ]
    }, {
        _type: 'TEXT', // TEXT | AUDIO
        text: 'I’m sorry to hear that. Are you new to New York?',
        answers: [ 'Yes! I just arrived this morning. ', 'No, I’ve lived here my whole life.' ]
    }, {
        _type: 'TEXT', // TEXT | AUDIO
        text: 'What are you going to do here?',
        answers: [ 'I want to live here and do an internship.', 'I’m going to study arts' ]
    }, {
        _type: 'TEXT', // TEXT | AUDIO
        text: 'An internship? How exciting! Where will you stay?',
        answers: [ 'I will live with four other persons in a flat in Brooklyn.', 'I don’t know. Maybe under a bridge?' ]
    }, {
        _type: 'TEXT', // TEXT | AUDIO
        text: 'Brooklyn, hum? Let me give you an advice, since we almost reached Brooklynn. The fastest way from the shuttle station to your new appartment will be by Taxi! Tell them where you need to go and they will bring you there for only a small fee. I wish you a good start here in NYC! Maybe we will meet again!',
    }]
}));

// task 7
//var task7ImageFile = fs.readFileSync(__dirname + '/images/task7.png');
//var task7Image = add(new Schema.Mediabank({
//    name: 'default',
//    contentType: 'image/png',
//    length: task7ImageFile.length,
//    buffer: task7ImageFile,
//    created: Date.now(),
//    owner: 'admin
//}));

var task7 = add(new Schema.Task({
    owner: 'admin',
    name: 'Spending time in a coffee shop',
    desc: 'You have entered a small cosy coffee shop opposite your apartment. Order a coffee.',
    dueDate: Date.now(),
    shortInfo: '',
    state: 'mandatory',

    character: {
        name: 'a german waitress working in a coffee shop',
        desc: 'Michelle Thompson is a german exchange stundent who  just recently started to work in the coffee shop. She is open minded and likes being among people. She is a reliable and polite waitress who enjoys her new job.',
        image: {
            name: 'default',
            contentType: 'image/png',
            length: michelleImageFile.length,
            buffer: michelleImageFile,
            created: Date.now(),
        },
    },
    location: {
        name: 'Harley Street apartment',
        desc: 'New Yorkers love coffee which is why you find coffee shops all over the place. Customers are offered a variety of hot drinks and tasty bites.',
    },
    chat: [ {
        _type: 'TEXT', // TEXT | AUDIO
        text: 'Hi, may I take your order?',
        answers: [ 'I haven’t had a chance to decide!', 'I would like to have a cinnamon hot chocolate and a piece of cheesecake please.' ]
    }, {
        _type: 'TEXT', // TEXT | AUDIO
        text: 'Sure, can I get you anything else?',
        answers: [ 'That’s all for now, thanks!', 'Maybe a little later' ]
    }]
}));

// task 8
//var task8ImageFile = fs.readFileSync(__dirname + '/images/task8.png');
//var task8Image = add(new Schema.Mediabank({
//    name: 'default',
//    contentType: 'image/png',
//    length: task8ImageFile.length,
//    buffer: task8ImageFile,
//    created: Date.now(),
//    owner: 'admin
//}));

var task8 = add(new Schema.Task({
    owner: 'admin',
    name: 'Spending time in a coffee shop',
    desc: 'You have entered a small cosy coffee shop opposite your apartment. Order a coffee.',
    dueDate: Date.now(),
    shortInfo: '',
    state: 'mandatory',

    character: {
        name: 'a german waitress working in a coffee shop',
        desc: 'Michelle Thompson is a german exchange stundent who  just recently started to work in the coffee shop. She is open minded and likes being among people. She is a reliable and polite waitress who enjoys her new job.',
        image: {
            name: 'default',
            contentType: 'image/png',
            length: michelleImageFile.length,
            buffer: michelleImageFile,
            created: Date.now(),
        },
    },
    location: {
        name: 'Harley Street apartment',
        desc: 'New Yorkers love coffee which is why you find coffee shops all over the place. Customers are offered a variety of hot drinks and tasty bites.',
    },
    chat: [ {
        _type: 'TEXT', // TEXT | AUDIO
        //text: '',
        answers: [ 'Excuse me, I ordered a cinnamon hot chocolate without whipped cream. Could I get a new one please?', 'Sorry, I guess there was a missunderstanding. I ordered a cinnamon hot chocolate without whipped cream.' ]
    }, {
        _type: 'TEXT', // TEXT | AUDIO
        text: 'Oh, I apologize for that! I will certainly bring you a new one.',
        answers: [ 'Don’t worry, that happens.', 'Thank you, that would be lovely.' ]
    }]
}));

// task 9
//var task9ImageFile = fs.readFileSync(__dirname + '/images/task9.png');
//var task9Image = add(new Schema.Mediabank({
//    name: 'default',
//    contentType: 'image/png',
//    length: task9ImageFile.length,
//    buffer: task9ImageFile,
//    created: Date.now(),
//    owner: 'admin
//}));

var task9 = add(new Schema.Task({
    owner: 'admin',
    name: 'Small Talk with neighbour at nearby table',
    desc: 'You have spent quite a while in this coffee shop now. Your use the opportunity to take a look into your map. Suddenly a man at the opposite table asks you whether you need any tipps during your stay in NYC. Start a conversation.',
    dueDate: Date.now(),
    shortInfo: 'Try and find out more anout New York City',
    state: 'mandatory',

    character: {
        name: 'John Parker',
        desc: 'If you have any questions considering precious tipps all about the various tourist attractions NCY offers- ask John Parker! He has never lived anywhere else than in Brooklyn and will have valuable recommendations for you.',
        image: {
            name: 'default',
            contentType: 'image/png',
            length: parkerImageFile.length,
            buffer: parkerImageFile,
            created: Date.now(),
        },
    },
    //location: {
    //},
    chat: [ {
        _type: 'TEXT', // TEXT | AUDIO
        text: 'Hi, are you here on holiday?',
        answers: [ 'Hello, well I am actually here for an internship.', 'Hello, no exactly holiday. I have just arrived to today though and have never been to New York City before.' ]
    }, {
        _type: 'TEXT', // TEXT | AUDIO
        text: 'I see, well I have a couple of good tipps that might be of interest to you during your stay here!',
        answers: [ 'That sounds great! ', 'Why not, I’m sure there’s a lot to see and do' ]
    }, {
        _type: 'TEXT', // TEXT | AUDIO
        text: 'Indeed, New York offers a lot for young people.',
    }]
}));

// scenes
// scene 1
var scene1ImageFile = fs.readFileSync(__dirname + '/images/scene1.png');
var scene1Image = add(new Schema.Mediabank({
    name: 'default',
    contentType: 'image/png',
    length: scene1ImageFile.length,
    buffer: scene1ImageFile,
    created: Date.now(),
    owner: 'admin'
}));
var scene1 = add(new Schema.Scene({
    owner: 'admin',
    name: 'Getting through the Airport',
    image: {
        name: 'default',
        contentType: 'image/png',
        length: scene1ImageFile.length,
        buffer: scene1ImageFile,
        created: Date.now(),
    },
    location: {
        name: 'JFK International Airport',
        desc: 'This is John F. Kennedy International Airport. It is the busiest international airport in the United States with more than 53 Million passengers a year.',
        lon: 40.6397,
        lat: 73.7789,
        image: {
            name: 'airport',
            contentType: 'image/png',
            length: jfkImageFile.length,
            buffer: jfkImageFile,
            created: Date.now(),
        },
    },
    desc: 'Welcome to New York City, "The Big Apple". You have a big adventure coming. Your machine just landed and you need to get through the Airport’s Customs. In this scene, you have to complete tasks, concerned with getting through customs, claiming your baggage and leaving the airport.',
    tasks: [ task1._id, task2._id, task3._id ]
}));

// scene 2
//2var scene2ImageFile = fs.readFileSync(__dirname + '/images/scene2.png');
//var scene2Image = add(new Schema.Mediabank({
//    name: 'default',
//    contentType: 'image/png',
//    length: scene2ImageFile.length,
//    buffer: scene2ImageFile,
//    created: Date.now(),
//    owner: 'admin
//}));
var scene2 = add(new Schema.Scene({
    owner: 'admin',
    name: 'Commuting to NYC',
    desc: 'You’ve made it through the airport. Loosing your suitcase was a huge shock but you slowly recover and want to get to your appartment as soon as possible. In this scene, you are on the bus shuttle: get a ticket at the bus drivers cabin and talk to a stranger sitting next to you.',
    tasks: [ task5._id, task5._id, task6._id ],
    location: {
        name: 'On the Bus',
        desc: 'JFK and NYC are connected by a shuttle bus service. Travelers can use the bus for a small fee to reach the city. The driving time depends on the traffic conditions.',
    },
}));

// scene 3
var scene3ImageFile = fs.readFileSync(__dirname + '/images/scene3.png');
var scene3Image = add(new Schema.Mediabank({
    name: 'default',
    contentType: 'image/png',
    length: scene3ImageFile.length,
    buffer: scene3ImageFile,
    created: Date.now(),
    owner: 'admin'
}));
var scene3 = add(new Schema.Scene({
    owner: 'admin',
    name: 'Coffee shop',
    desc: 'Now you have arrived at your new apartment you discover that non of your flat mates are at home to open the door. You decide to spent time in a near by coffee shop until your flat mates return to the apartment.',
    tasks: [ task7._id, task8._id, task9._id ],
    location: {
        name: 'Harley Street apartment',
        desc: 'New Yorkers love coffee which is why you find coffee shops all over the place. Customers are offered a variety of hot drinks and tasty bites.',
    },
    image: {
        name: 'default',
        contentType: 'image/png',
        length: scene3ImageFile.length,
        buffer: scene3ImageFile,
        created: Date.now(),
    }
}));

// episodes
// episode 1
var episode1 = add(new Schema.Episode({
    name: 'Arriving in New York',
    scenes: [ scene1._id, scene2._id, scene3._id ]
}));

// courses
var course1 = add(new Schema.Course( {
    name: 'New York Trip',
    desc: 'Course description',
    episodes: [ episode1._id ]
}));

// classes
var class1 = add(new Schema.Class({
    name: 'Test teacher class',
    desc: 'Class description',
    code: '12345',
    courses: [ course1 ],
    tutor: testTeacher._id,
    // users: [ johnDoe._id, janeDoe._id, fedirKlymenko, dimaRadchenko, sviatoslavTesliak ],
    users: [ philipUser._id, janUser._id, johnDoe._id, janeDoe._id, fedirKlymenko, dimaRadchenko, sviatoslavTesliak ],
    currentCourse: course1._id,
    created: Date.now()
}));
testTeacher.classes.push(class1._id);

// var class2 = add(new Schema.Class({
//     name: 'Jan Class',
//     desc: 'Class description',
//     code: '12345',
//     courses: [ course1 ],
//     tutor: janTutor._id,
//     users: [ johnDoe._id, janeDoe._id, fedirKlymenko, dimaRadchenko, sviatoslavTesliak ],
//     currentCourse: course1._id,
//     created: Date.now()
// }));
// janTutor.classes.push(class2._id);

// var class3 = add(new Schema.Class({
//     name: 'Philip Class',
//     desc: 'Class description',
//     code: '12345',
//     courses: [ course1 ],
//     tutor: philipTutor._id,
//     users: [ johnDoe._id, janeDoe._id, fedirKlymenko, dimaRadchenko, sviatoslavTesliak ],
//     currentCourse: course1._id,
//     created: Date.now()
// }));
// philipTutor.classes.push(class3._id);

// johnDoe.classes.push(class1._id, class2._id, class3._id);
// janeDoe.classes.push(class1._id, class2._id, class3._id);
// fedirKlymenko.classes.push(class1._id, class2._id, class3._id);
// dimaRadchenko.classes.push(class1._id, class2._id, class3._id);
// sviatoslavTesliak.classes.push(class1._id, class2._id, class3._id);

// janUser.classes.push(class1._id, class2._id, class3._id);
// philipUser.classes.push(class1._id, class2._id, class3._id);

johnDoe.classes.push(class1._id);
janeDoe.classes.push(class1._id);
fedirKlymenko.classes.push(class1._id);
dimaRadchenko.classes.push(class1._id);
sviatoslavTesliak.classes.push(class1._id);

janUser.classes.push(class1._id);
philipUser.classes.push(class1._id);

// add mediabank items
var image1ImageFile = fs.readFileSync(__dirname + '/images/image1.png');
var image1Image = add(new Schema.Mediabank({
    name: 'default',
    contentType: 'image/png',
    length: image1ImageFile.length,
    buffer: image1ImageFile,
    created: Date.now(),
    owner: 'admin'
}));

var image2ImageFile = fs.readFileSync(__dirname + '/images/image2.png');
var image2Image = add(new Schema.Mediabank({
    name: 'default',
    contentType: 'image/png',
    length: image2ImageFile.length,
    buffer: image2ImageFile,
    created: Date.now(),
    owner: 'admin'
}));

var image3ImageFile = fs.readFileSync(__dirname + '/images/image3.png');
var image3Image = add(new Schema.Mediabank({
    name: 'default',
    contentType: 'image/png',
    length: image3ImageFile.length,
    buffer: image3ImageFile,
    created: Date.now(),
    owner: 'admin'
}));

var image4ImageFile = fs.readFileSync(__dirname + '/images/image4.png');
var image4Image = add(new Schema.Mediabank({
    name: 'default',
    contentType: 'image/png',
    length: image4ImageFile.length,
    buffer: image4ImageFile,
    created: Date.now(),
    owner: 'admin'
}));

// clear database before saving data
async.parallel([
    (done) => { Schema.User.remove({}, (e) => { done() }) },
    (done) => { Schema.Class.remove({}, (e) => { done() }) },
    (done) => { Schema.Course.remove({}, (e) => { done() }) },
    (done) => { Schema.Episode.remove({}, (e) => { done() }) },
    (done) => { Schema.Scene.remove({}, (e) => { done() }) },
    (done) => { Schema.Task.remove({}, (e) => { done() }) },
    (done) => { Schema.Character.remove({}, (e) => { done() }) },
    (done) => { Schema.Location.remove({}, (e) => { done() }) },
    (done) => { Schema.Image.remove({}, (e) => { done() }) },
    (done) => { Schema.Audio.remove({}, (e) => { done() }) },
    (done) => { Schema.Mediabank.remove({}, (e) => { done() }) }
    ], (e, r) => {
        console.log('Database cleared');

        async.parallel(func, () => {
            console.log('Database updated');
            process.exit()
        })
    });
