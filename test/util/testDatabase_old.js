var Schema = require('../../lib/database/models');
var _ = require('underscore');
var async = require('async');
var fs = require('fs');

function readFile(path) {
    if(!path) throw 'Path should not be empty!'
    return fs.readFileSync(__dirname + path);
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

function addLocation(imagePath, o) {
    if(!imagePath || imagePath == '') {
        var obj = add(new Schema.Location({
            name: o.name,
            desc: o.desc,
            lon: o.lon,
            lat: o.lat,
            //image: image._id
        }));

        return obj;
    }

    var imageFile = readFile(imagePath);
    var image = add(new Schema.Image({
        name: 'default',
        contentType: 'image/png',
        length: imageFile.length,
        buffer: imageFile
    }));

    var obj = add(new Schema.Location({
        name: o.name,
        desc: o.desc,
        lon: o.lon,
        lat: o.lat,
        image: image._id
    }));

    return obj;
}

function addCharacter(imagePath, o) {
    if(!imagePath || imagePath == '') {
        var obj = add(new Schema.Character({
            name: o.name,
            desc: o.desc,
            //image: image._id
        }));

        return obj;
    }

    var imageFile = readFile(imagePath);
    var image = add(new Schema.Image({
        name: 'default',
        contentType: 'image/png',
        length: imageFile.length,
        buffer: imageFile
    }));

    var obj = add(new Schema.Character({
        name: o.name,
        desc: o.desc,
        image: image._id
    }));

    return obj;
}

// audio
var audioWav = readFile('/audio.wav');
var audioOgg = readFile('/audio.ogg');

var defaultMediabankImage = readFile('/default.png');
var mdTestImage = add(new Schema.Mediabank({
    name: 'default',
    contentType: 'image/png',
    length: defaultMediabankImage.length,
    buffer: defaultMediabankImage,
    created: Date.now()
}));

// image
var defaultImage = readFile('/default.png');
var officer = readFile('/police-officer.jpg');
var location = readFile('/default.png');

var image = add(new Schema.Image({
    name: 'default',
    contentType: 'image/png',
    length: defaultImage.length,
    buffer: defaultImage
}));

// image for scene 1

var scene1img = readFile('/scene1.png');
var image1 = add(new Schema.Image({
    name: 'default',
    contentType: 'image/png',
    length: scene1img.length,
    buffer: scene1img
}));

var task3ImageFile = readFile('/task3Image.png');
var task3Image = add(new Schema.Image({
    name: 'default',
    contentType: 'image/png',
    length: task3ImageFile.length,
    buffer: task3ImageFile
}));

var task4ImageFile = readFile('/task4Image.png');
var task4Image = add(new Schema.Image({
    name: 'default',
    contentType: 'image/png',
    length: task4ImageFile.length,
    buffer: task4ImageFile
}));

var task5ImageFile = readFile('/task5Image.png');
var task5Image = add(new Schema.Image({
    name: 'default',
    contentType: 'image/png',
    length: task5ImageFile.length,
    buffer: task5ImageFile
}));

// episode 1 image
var episode1ImageFile = readFile('/scene1.png');
var episode1Image = add(new Schema.Image({
    name: 'default',
    contentType: 'image/png',
    length: episode1ImageFile.length,
    buffer: episode1ImageFile
}));

var task1ImageFile = readFile('/task1.png');
var task1Image = add(new Schema.Image({
    name: 'default',
    contentType: 'image/png',
    length: task1ImageFile.length,
    buffer: task1ImageFile
}));

var task2ImageFile = readFile('/task2.png');
var task2Image = add(new Schema.Image({
    name: 'default',
    contentType: 'image/png',
    length: task2ImageFile.length,
    buffer: task2ImageFile
}));

var task5ImageFile = readFile('/task5image.png');
var task5Image = add(new Schema.Image({
    name: 'default',
    contentType: 'image/png',
    length: task5ImageFile.length,
    buffer: task5ImageFile
}));

var characterImage = add(new Schema.Image({
    name: 'default',
    contentType: 'image/png',
    length: officer.length,
    buffer: officer
}));

var locationImage = add(new Schema.Image({
    name: 'default',
    contentType: 'image/png',
    length: location.length,
    buffer: location
}));

// JFK Image
var jfkImageFile = fs.readFileSync(__dirname + '/jfkImage.png');
var jfkImage = add(new Schema.Image({
    name: 'default',
    contentType: 'image/png',
    length: jfkImageFile.length,
    buffer: jfkImageFile
}));

var cbpImageFile = fs.readFileSync(__dirname + '/jfkImage.png');
var cbpImage = add(new Schema.Image({
    name: 'default',
    contentType: 'image/png',
    length: cbpImageFile.length,
    buffer: cbpImageFile
}));

var ojoneFile = fs.readFileSync(__dirname + '/ojoneilImage.png');
var ojoneilImage = add(new Schema.Image({
    name: 'default',
    contentType: 'image/png',
    length: ojoneFile.length,
    buffer: ojoneFile
}));

var jessicaThornFile = fs.readFileSync(__dirname + '/jessicaThorn.png');
var jessicaThornImage = add(new Schema.Image({
    name: 'default',
    contentType: 'image/png',
    length: jessicaThornFile.length,
    buffer: jessicaThornFile
}));

var ShilohFile = fs.readFileSync(__dirname + '/shiloh.png');
var ShilohImage = add(new Schema.Image({
    name: 'default',
    contentType: 'image/png',
    length: ShilohFile.length,
    buffer: ShilohFile
}));

// audio
var audio1 = add(new Schema.Audio({
    name: 'audio-wav',
    contentType: 'audio/wav',
    length: audioWav.length,
    buffer: audioWav
}));

var audio2 = add(new Schema.Audio({
    name: 'audio-ogg',
    contentType: 'audio/ogg',
    length: audioOgg.length,
    buffer: audioOgg
}));

// super admin
var superAdmin = add(new Schema.User({
    first_name: 'Super',
    last_name: 'Admin',
    email: 'admin@ex.com',
    password: 'admin',
    token: '5571a7f5-0aeb-43cf-8e0b-4636bba7cbf6',
    role: 'admin',
    image: image._id,

    gender: 'Male',
    country: 'USA',
    language: 'English',
    registered: Date.now(),
    phone: '+0 000 12345678',
    birthday: Date.now() - 36000,
}));

var secAdmin = add(new Schema.User({
    first_name: 'Second',
    last_name: 'Admin',
    email: 'secadmin@ex.com',
    password: 'admin',
    token: '1171a7f5-0aeb-43cf-8e0b-4636bba73212',
    role: 'admin',
    image: image._id,

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
    password: '12345',
    token: '5a1d07e5-ec0c-4041-b2b9-f1f238caa952',
    classes: [],
    role: 'teacher',
    image: image._id,

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
    password: '12345',
    token: '3ded76dd-7b0b-4e60-b2c2-a3e4ff10a530',
    classes: [],
    role: 'teacher',
    image: image._id,

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
    password: '12345',
    token: 'fcaa3b14-8e25-4ac8-b27a-814548b0e2bc',
    classes: [],
    role: 'teacher',
    image: image._id,

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
    password: 'john',
    token: '42f60264-1dc9-459a-a34f-310be4de14c5',
    classes: [],
    role: 'teacher',
    image: image._id,

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
    password: 'jane',
    token: '14382acd-53c1-4389-bb5a-afec18111606',
    classes: [],
    role: 'user',
    image: image._id,

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
    password: 'bob',
    token: '68bd6ab2-d8ba-4f09-a1df-47461e48518e',
    classes: [],
    role: 'user',
    image: image._id,

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
    password: '12345',
    token: 'e5fd8f55-de59-4f8c-ac06-089464954bc9',
    classes: [],
    role: 'user',
    image: image._id,

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
    password: '12345',
    token: 'd15fb301-7b89-4bea-a63e-a33d24d53ea8',
    classes: [],
    role: 'user',
    image: image._id,

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
    password: '12345',
    token: '9e001fee-0021-47d1-ae21-e3f66bd4b03d',
    classes: [],
    role: 'user',
    image: image._id,

    gender: 'Male',
    country: 'Ukraine',
    language: 'Ukrainian',
    registered: Date.now(),
    phone: '+0 000 12345678',
    birthday: Date.now() - 36000,
}));

// character
var character1 = add(new Schema.Character({
    name: 'Jack the officer',
    desc: 'Good officer and policeman',
    image: characterImage._id
}));

// character
var CBPCharacter = add(new Schema.Character({
    name: 'Jack the officer',
    desc: 'Good officer and policeman',
    image: cbpImage._id
}));


// Jessica Thorn
var jessicaThorn = add(new Schema.Character({
    name: 'Mrs. Jessica Thorn',
    desc: 'Mrs. Thorn, 32, works at the information point since 8 years. She loves to help travellers find their way and tells them more about the city.',
    image: jessicaThornImage._id
}));

// character
var oJamesOneilCharacter = add(new Schema.Character({
    name: 'Jack the officer',
    desc: 'Good officer and policeman',
    image: ojoneilImage._id
}));

// Alex Thatcher
var alexTatcherFile = readFile('/alexTatcher.png');
var alexTatcherImage = add(new Schema.Image({
    name: 'default',
    contentType: 'image/png',
    length: alexTatcherFile.length,
    buffer: alexTatcherFile
}));

var alexTatcherCharacter = add(new Schema.Character({
    name: 'Jack the officer',
    desc: 'Good officer and policeman',
    image: {
        name: 'default',
        contentType: 'image/png',
        length: alexTatcherFile.length,
        buffer: alexTatcherFile
    }
}));

var ShilohCharacter = add(new Schema.Character({
    name: 'Shiloh Witherspoon',
    desc: 'Women on the bus: Shiloh Witherspoon',
    image: {
        name: 'default',
        contentType: 'image/png',
        length: ShilohImage.length,
        buffer: ShilohImage
    }
}));

// location
var jfkLocation = add(new Schema.Location({
    name: 'JFK International Airport',
    desc: 'This is John F. Kennedy International Airport. It is the busiest international airport in the United States with more than 53 Million passengers a year.',
    lon: 40.6397,
    lat: 73.7789,
    image: jfkImage._id
}));

// On the bus location
var scene1img = readFile('/scene1.png');
var image1 = add(new Schema.Image({
    name: 'default',
    contentType: 'image/png',
    length: scene1img.length,
    buffer: scene1img
}));

var onTheBusLocation = add(new Schema.Location({
    name: 'On the Bus',
    desc: 'JFK and NYC are connected by a shuttle bus service. Travelers can use the bus for a small fee to reach the city. The driving time depends on the traffic conditions.',
    // lon: 40.6397,
    // lat: 73.7789,
    // image: jfkImage._id
}));

// Bus station
var busStationFile = readFile('/scene1.png');
var busStationImage = add(new Schema.Image({
    name: 'default',
    contentType: 'image/png',
    length: busStationFile.length,
    buffer: busStationFile
}));

var BusStationLocation = add(new Schema.Location({
    name: 'Bus Station',
    desc: 'Bus station',
    // lon: 40.6397,
    // lat: 73.7789,
    // image: busStationImage._id
}));

var location2 = add(new Schema.Location({
    name: 'Africa',
    desc: 'Africa Police Department',
    lon: 1.156,
    lat: 4.687,
    image: locationImage._id
}));

var location3 = add(new Schema.Location({
    name: 'Japanece chinatown',
    desc: 'Best food',
    lon: 10.456,
    lat: 3.687,
    image: locationImage._id
}));

var location4 = add(new Schema.Location({
    name: 'Bermuda triangle',
    desc: 'Where ships dissapear',
    lon: 32.3000,
    lat: 64.7833,
    image: locationImage._id
}));

var location5 = add(new Schema.Location({
    name: 'Stonehenge',
    desc: 'Stone rock stonehenge',
    lon: 51.1788,
    lat: 1.8262,
    image: locationImage._id
}));

// tasks
var task1 = add(new Schema.Task({
    image: task1Image._id,
    name: 'Talk to the CBP Officer',
    desc: 'Talk to the Customs and Border Protection Officer. They will ask you where you are from and what you will do in the United States. You may also eavesdrop to the people in line before you, so you get an idea, what’s coming at you.',
    goal: 'Some goal',
    _type: 'RECOGNITION',
    shortInfo: 'Tell the CBP Officer who you are and what you intend to do.',
    dueDate: Date.now(),
    character: {
        name: 'Officer Roger Murtaugh',
        desc: 'Officer Murtaugh, 51, lives in New Jersey and has worked for CBP for 22 years. He has a lot of experience and takes his job very seriously.',
        image: CBPCharacter._id
    },
    location: {
        name: jfkLocation.name,
        desc: jfkLocation.desc,
        lon: jfkLocation.lon,
        lat: jfkLocation.lat,
        image: jfkLocation._id
    },
    chat: [ {
        question: {
            _type: 'TEXT', // TEXT | AUDIO
            text: ' Welcome to NYC. Can I see your passport please? I need to take a picture and your fingerprints. What’s the purpose of your stay?'
        },
        answer: [ 'I want to do an internship here.', 'I’m here for a business trip.' ]
    }, {
        question: {
            _type: 'TEXT', // TEXT | AUDIO
            text: 'Where will you stay?',
            // audioId: audio1._id
        },
        answer: [ 'I will live in an apartment in Manhattan.', 'I will stay at the Hilton Hotel.' ]
    }, {
        question: {
            _type: 'TEXT', // TEXT | AUDIO
            text: 'How long will you stay here?',
            // audioId: audio1._id
        },
        answer: [ 'As long as I find work.', 'I haven’t planned my return, yet.' ]
    }, {
        question: {
            _type: 'TEXT', // TEXT | AUDIO
            text: 'Do you have anything to declare?',
            // audioId: audio1._id
        },
        answer: [ 'No, I haven’t.', 'Yes, three bottles of Whiskey.' ]
    }, {
        question: {
            _type: 'TEXT', // TEXT | AUDIO
            text: 'Alright! Enjoy your stay. The baggage claim is to the right.',
            // audioId: audio1._id
        },
    }]
}));

var task2 = add(new Schema.Task({
    image: task2Image._id,
    name: 'Lost Baggage',
    shortInfo: 'Your baggage is lost and you have to talk to an officer.',
    desc: 'After waiting for all the baggage to be on the caroussel you realize, that your suitcase isn’t there. You have to tell an Officer about your missing items and give them your address.',
    dueDate: Date.now(),
    goal: 'Some goal',
    _type: 'RECOGNITION',
    character: {
        name: oJamesOneilCharacter.name,
        desc: oJamesOneilCharacter.desc,
        image: oJamesOneilCharacter.image,
    },
    location: {
        name: jfkLocation.name,
        desc: jfkLocation.desc,
        lon: jfkLocation.lon,
        lat: jfkLocation.lat,
        image: jfkLocation._id
    },
    chat: [ {
        question: {
            _type: 'TEXT', // TEXT | AUDIO
            text: 'Good morning! How can I help you?'
        },
        answer: [ 'I’m missing my suitcase.', 'My dog has run away.' ]
    }, {
        question: {
            _type: 'TEXT', // TEXT | AUDIO
            text: 'I’m sorry to hear that! We will do everything to find your personal items and bring them to you, as soon as they have been found!. Can you please give me your address?',
            // audioId: audio1._id
        },
        answer: [ 'I live on 400 W 55th St,  New York, NY 10019', 'I will sleep at Burger King.' ]
    }, {
        question: {
            _type: 'TEXT', // TEXT | AUDIO
            text: 'And can you give me your telephone number or an email where we can contact you if necessary?',
            // audioId: audio1._id
        },
        answer: [ '+1 212-405-97683', 'Love.Traveling@gmail.com' ]
    }, {
        question: {
            _type: 'TEXT', // TEXT | AUDIO
            text: 'Can you please describe your missing suitcase as detailed as possible?',
            // audioId: audio1._id
        },
        answer: [ 'It is a green hard shell suitcase with different stickers stuck to it.', 'It’s a yellow bag with a rainbow colored ribbon tied to it.' ]
    }, {
        question: {
            _type: 'TEXT', // TEXT | AUDIO
            text: 'Thanks! We will deliver the suitcase to you as soon as we find it. Here is our business card. Feel free to call us if you have any further questions.',
            // audioId: audio1._id
        },
    }]
}));

var task3 = add(new Schema.Task({
    image: task3Image._id,
    name: 'Scene 2 - Finding the shuttle service',
    desc: 'In Brooklyn you will see your apartment and meet your future roommates for the first time. Find out how best to get to your aparatment.',
    shortInfo: 'You commute from JFK International Airport to Brooklyn.',
    dueDate: Date.now(),
    _type: 'RECOGNITION',
    character: {
        name: jessicaThorn.name,
        desc: jessicaThorn.desc,
        image: jessicaThorn.image,
    },
    location: {
        name: jfkLocation.name,
        desc: jfkLocation.desc,
        lon: jfkLocation.lon,
        lat: jfkLocation.lat,
        image: jfkLocation._id
    },
    chat: [ {
        question: {
            _type: 'TEXT', // TEXT | AUDIO
            text: 'Hello! How can I be of help?'
        },
        answer: [ 'What is the fastest way to Brooklyn?', 'Where are the restrooms?' ]
    }, {
        question: {
            _type: 'TEXT', // TEXT | AUDIO
            text: 'The fastest way to Brooklyn would be the train, but it is expensive and doesn’t run as frequently as the shuttle. The shuttle can be problematic with a lot of traffic though. But still I recommend taking the shuttle!',
            // audioId: audio1._id
        },
        answer: [ 'Where do I find the shuttle?', 'Can you sell me a ticket for the shuttle?' ]
    }, {
        question: {
            _type: 'TEXT', // TEXT | AUDIO
            text: 'Just go down this hallway and turn left. You will find signs pointing to the shuttle service. Buy a ticket at the bus drivers cabin.',
            // audioId: audio1._id
        },
        answer: [ '+1 212-405-97683', 'Love.Traveling@gmail.com' ]
    }]
}));

var task4 = add(new Schema.Task({
    image: task4Image._id,
    name: 'Buy a ticket',
    desc: 'In order to take the shuttle you need a ticket.Talk to the bus driver to buy your ticket to Brooklynn.',
    shortInfo: 'You have to buy a ticket for the shuttle bus.',
    dueDate: Date.now(),
    _type: 'RECOGNITION',
    character: {
        name: alexTatcherCharacter.name,
        desc: alexTatcherCharacter.desc,
        image: alexTatcherCharacter.image
    },
    location: {
        name: onTheBusLocation.name,
        desc: onTheBusLocation.desc,
        // lon: 32.3000,
        // lat: 64.7833,
        // image: locationImage._id
    },
    chat: [ {
        question: {
            _type: 'TEXT', // TEXT | AUDIO
            text: 'Good morning!'
        },
        answer: [ 'Good Morning! I would like to buy a ticket.', 'Hello. Can I use this shuttle for free?' ]
    }, {
        question: {
            _type: 'TEXT', // TEXT | AUDIO
            text: 'This is the shuttle to Brooklynn! A ticket costs $15. I can give you one if you have the amount with you.',
            // audioId: audio1._id
        },
        answer: [ 'Thank you! Here you are.', 'This is expensive! But okay, it is the only way for me. Here you are.' ]
    }, {
        question: {
            _type: 'TEXT', // TEXT | AUDIO
            text: 'Here is your ticket! Enjoy your stay.',
            // audioId: audio1._id
        },
    }]
}));

var task5 = add(new Schema.Task({
    image: task5Image._id,
    name: 'Traffic',
    desc: 'There is a traffic jam causing the bus to stop. You are getting nervous that you won’t make it on time to the city to meet your new room mates. Talk to a stranger about your fears.',
    dueDate: Date.now(),
    _type: 'RECOGNITION',
    shortInfo: 'Talk to a stranger about the traffic jam.',
    character: {
        name: ShilohCharacter.name,
        desc: ShilohCharacter.desc,
        image: ShilohCharacter.image
    },
    location: {
        name: BusStationLocation.name,
        desc: BusStationLocation.desc,
        // lon: 51.1788,
        // lat: 1.8262,
        // image: locationImage._id
    },
    chat: [ {
        question: {
            _type: 'TEXT', // TEXT | AUDIO
            text: 'You look worried. What’s the matter?'
        },
        answer: [ 'I have to get to Brooklynn. This traffic jam makes me late to meet my new roommates!', 'I just don’t like traffic jams.' ]
    }, {
        question: {
            _type: 'TEXT', // TEXT | AUDIO
            text: 'I’m sorry to hear that. Are you new to New York?',
            // audioId: audio1._id
        },
        answer: [ 'Yes! I just arrived this morning. ', 'No, I’ve lived here my whole life.' ]
    }, {
        question: {
            _type: 'TEXT', // TEXT | AUDIO
            text: 'What are you going to do here?',
            // audioId: audio1._id
        },
        answer: [ 'I want to live here and do an internship.', 'I’m going to study arts' ]
    }, {
        question: {
            _type: 'TEXT', // TEXT | AUDIO
            text: 'An internship? How exciting! Where will you stay?',
            // audioId: audio1._id
        },
        answer: [ 'I will live with four other persons in a flat in Brooklyn.', 'I don’t know. Maybe under a bridge?' ]
    }, {
        question: {
            _type: 'TEXT', // TEXT | AUDIO
            text: 'Brooklyn, hum? Let me give you an advice, since we almost reached Brooklynn. The fastest way from the shuttle station to your new appartment will be by Taxi! Tell them where you need to go and they will bring you there for only a small fee. I wish you a good start here in NYC! Maybe we will meet again!',
            // audioId: audio1._id
        },
    }]
}));

var task6 = add(new Schema.Task({
    //image: task6Image._id,
    name: 'Finding Your Appartment',
    desc: 'There is a traffic jam causing the bus to stop. You are getting nervous that you won’t make it on time to the city to meet your new room mates. Talk to a stranger about your fears.',
    dueDate: Date.now(),
    _type: 'RECOGNITION',
    shortInfo: 'Talk to a stranger about the traffic jam.',
    character: {
        name: ShilohCharacter.name,
        desc: ShilohCharacter.desc,
        image: ShilohCharacter.image
    },
    location: {
        name: BusStationLocation.name,
        desc: BusStationLocation.desc,
        // lon: 51.1788,
        // lat: 1.8262,
        // image: locationImage._id
    },
    chat: [ {
        question: {
            _type: 'TEXT', // TEXT | AUDIO
            text: 'You look worried. What’s the matter?'
        },
        answer: [ 'I have to get to Brooklynn. This traffic jam makes me late to meet my new roommates!', 'I just don’t like traffic jams.' ]
    }, {
        question: {
            _type: 'TEXT', // TEXT | AUDIO
            text: 'I’m sorry to hear that. Are you new to New York?',
            // audioId: audio1._id
        },
        answer: [ 'Yes! I just arrived this morning. ', 'No, I’ve lived here my whole life.' ]
    }, {
        question: {
            _type: 'TEXT', // TEXT | AUDIO
            text: 'What are you going to do here?',
            // audioId: audio1._id
        },
        answer: [ 'I want to live here and do an internship.', 'I’m going to study arts' ]
    }, {
        question: {
            _type: 'TEXT', // TEXT | AUDIO
            text: 'An internship? How exciting! Where will you stay?',
            // audioId: audio1._id
        },
        answer: [ 'I will live with four other persons in a flat in Brooklyn.', 'I don’t know. Maybe under a bridge?' ]
    }, {
        question: {
            _type: 'TEXT', // TEXT | AUDIO
            text: 'Brooklyn, hum? Let me give you an advice, since we almost reached Brooklynn. The fastest way from the shuttle station to your new appartment will be by Taxi! Tell them where you need to go and they will bring you there for only a small fee. I wish you a good start here in NYC! Maybe we will meet again!',
            // audioId: audio1._id
        },
    }]
}));

// scenes
var scene1 = add(new Schema.Scene({
    name: 'Getting through the Airport',
    image: image1._id,
    desc: 'Welcome to New York City, "The Big Apple". You have a big adventure coming. Your machine just landed and you need to get through the Airport’s Customs. In this scene, you have to complete tasks, concerned with getting through customs, claiming your baggage and leaving the airport.',
    tasks: [ task1._id, task2._id, task3._id ]
}));

var scene2 = add(new Schema.Scene({
    name: 'Commuting to NYC',
    desc: 'You’ve made it through the airport. Loosing your suitcase was a huge shock but you slowly recover and want to get to your appartment as soon as possible. In this scene, you are on the bus shuttle: get a ticket at the bus drivers cabin and talk to a stranger sitting next to you.',
    tasks: [ task4._id, task5._id, task6._id ]
}));

var scene3 = add(new Schema.Scene({
    name: 'Scene 3',
    desc: 'Scene 3 description',
    tasks: [  ]
}));

var scene4 = add(new Schema.Scene({
    name: 'Scene 4',
    desc: 'Scene 4 description',
    tasks: [ task4._id, task5._id ]
}));

// episodes
var episode1 = add(new Schema.Episode({
    name: 'Arriving in New York',
    desc: '',
    image: episode1Image._id,
    scenes: [ scene1._id, scene2._id, scene3._id ]
}));

var episode2 = add(new Schema.Episode({
    name: 'Episode 2',
    desc: 'Episode 2 description',
    scenes: [ scene2._id ]
}));

var episode3 = add(new Schema.Episode({
    name: 'Episode 3',
    desc: 'Episode 3 description',
    scenes: [ scene3._id ]
}));

var episode4 = add(new Schema.Episode({
    name: 'Episode 4',
    desc: 'Episode 4 description',
    scenes: [ scene4._id ]
}));

// courses
var course1 = add(new Schema.Course( {
    name: 'New York Trip ',
    desc: 'Course description',
    episodes: [ episode1._id, episode2._id, episode3._id ]
}));

var course2 = add(new Schema.Course( {
    name: 'Course 2',
    desc: 'Course description',
    episodes: [ episode2._id ]
}));

// classes
var class1 = add(new Schema.Class({
    name: 'Class 1',
    desc: 'Class description',
    code: '12345',
    courses: [ course1, course2 ],
    users: [ johnDoe._id, janeDoe._id, fedirKlymenko, dimaRadchenko, sviatoslavTesliak ],
    currentCourse: course1._id
}));

var class2 = add(new Schema.Class({
    name: 'Class 2',
    desc: 'Class description',
    code: '321',
    courses: [ course2 ],
    users: [ bobDoe._id ],
    currentCourse: course2._id
}));

testTeacher.classes.push(class1._id, class2._id);

johnDoe.classes.push(class1._id, class2._id);
janeDoe.classes.push(class1._id);
bobDoe.classes.push(class2._id);

fedirKlymenko.classes.push(class1._id );
dimaRadchenko.classes.push(class1._id );
sviatoslavTesliak.classes.push(class1._id );

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
