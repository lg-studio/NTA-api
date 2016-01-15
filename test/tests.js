var superagent = require('superagent');
var _ = require('underscore');
var app = require('../app');
var assert = require('chai').assert;
var fs = require('fs');

var API_ROOT = 'http://localhost:3000';

var user;
var _class;
var course;
var episode;
var scene;
var task;
var character;
var location;

var testImage = fs.readFileSync(__dirname + '/util/default.png');

describe('authentification - Authentification API', function() {
    it('Returns registered user', function(done) {
        superagent.post(API_ROOT + '/v1/register')
            .send({
                first_name: "Test",
                last_name: "Test",
                email: "test@t.t",
                password: "12345",
                code: 12345
            })
            .end(function(err, res) {
                user = res.body;

                assert.equal(res.status, 200);
                assert.deepEqual({
                    first_name: user.first_name,
                    last_name: user.last_name,
                    email: user.email,
                    role: user.role
                }, {
                    first_name: 'Test',
                    last_name: 'Test',
                    email: 'test@t.t',
                    role: 'user'
                });

                done();
        });
    });

    it('Returns error because user already exists', function(done) {
        superagent.post(API_ROOT + '/v1/register')
            .send({
                first_name: "Test",
                last_name: "Test",
                email: "test@t.t",
                password: "12345",
                code: 12345
            })
            .end(function(err, res) {
                assert.equal(res.status, 400);
                assert.deepEqual(res.body, {
                    error: 'User with this id already exists'
                });

                done();
            });
    });

    it('Logouts user from the system', function(done) {
        superagent.post(API_ROOT + '/v1/logout')
            .set('Authorization', user.token)
            .end(function(err, res) {
                assert.equal(res.status, 200);

                done();
            });
    });

    it('Logs user and returns logged user information', function(done) {
        superagent.post(API_ROOT + '/v1/login')
            .send({
                email: "testteacher@ex.com",
                password: "12345"
            })
            .end(function(err, res) {
                user = res.body;

                assert.equal(res.status, 200);
                assert.deepEqual({
                    first_name: user.first_name,
                    last_name: user.last_name,
                    email: user.email,
                    role: user.role
                }, {
                    first_name: 'Test',
                    last_name: 'Teacher',
                    email: 'testteacher@ex.com',
                    role: 'teacher'
                });

                done();
            });
    });
});

describe('v1/classes - Class API', function() {
    it('Returns all classes where user is connected to', function(done) {
        superagent.get(API_ROOT + '/v1/classes')
            .set('Authorization', user.token)
            .end(function(err, res) {
                var data = res.body;
                _class = data[0];

                assert.equal(res.status, 200);
                assert.equal(res.body.length, 2);
                assert.deepEqual([{
                    name: data[0].name,
                    desc: data[0].desc,
                    code: data[0].code
                }, {
                    name: data[1].name,
                    desc: data[1].desc,
                    code: data[1].code
                }],[{
                    name: 'Class 1',
                    desc: 'Class description',
                    code: '12345'
                }, {
                    name: 'Class 2',
                    desc: 'Class description',
                    code: '321'
                }]);
                // class 1
                assert.equal(data[0].users.length, 5);
                assert.equal(data[0].courses.length, 2);

                // class 2
                assert.equal(data[1].users.length, 1);
                assert.equal(data[1].courses.length, 1);

                done();
            });
    });

    // TODO manage creating users and teachers as a different queries
    it('Creates new class and returns information about it', function(done) {
        superagent.post(API_ROOT + '/v1/classes')
            .set('Authorization', user.token)
            .send({
                name: "Test class",
                desc: "Class desc"
            })
            .end(function(err, res) {
                var data = res.body;

                assert.equal(res.status, 200);
                assert.deepEqual({
                    name: data.name,
                    desc: data.desc
                },{
                    name: "Test class",
                    desc: "Class desc"
                });

                assert.equal(data.users.length, 1);
                assert.equal(data.courses.length, 0);
                assert.equal(data.courses.currentCourse, null);

                done();
            });
    });

    it('Returns all users which are connected to this class', function(done) {
        superagent.get(API_ROOT + '/v1/classes/' + _class.id + '/users')
            .set('Authorization', user.token)
            .end(function(err, res) {
                var data = res.body;

                assert.equal(res.status, 200);

                data = _.map(data, (e) => {
                    return {
                        first_name: e.first_name,
                        last_name: e.last_name,
                        email: e.email,
                        role: e.role,
                        classes: e.classes.length
                    }
                })

                assert.deepEqual(data, [{
                    first_name: 'John',
                    last_name: 'Doe',
                    email: 'john@ex.com',
                    role: 'teacher',
                    classes: 2
                }, {
                    first_name: 'Jane',
                    last_name: 'Doe',
                    email: 'jane@ex.com',
                    role: 'user',
                    classes: 1
                }, {
                    first_name: 'Fedir',
                    last_name: 'Klymenko',
                    email: 'fedir@ex.com',
                    role: 'user',
                    classes: 1
                }, {
                    first_name: 'Dima',
                    last_name: 'Rad',
                    email: 'dima@ex.com',
                    role: 'user',
                    classes: 1
                }, {
                    first_name: 'Sviatoslav',
                    last_name: 'Tesliak',
                    email: 'sviatoslav@ex.com',
                    role: 'user',
                    classes: 1
                }]);

                done();
            });
    });

    // Create test user and remove it
    // TODO manage creating users and teachers as a different queries
    it.skip('Registers a new user and removes him from class', function(done) {
        superagent.post(API_ROOT + '/v1/register')
            .send({
                first_name: "Test1",
                last_name: "Test1",
                email: "test123@t.t",
                password: "12345",
                code: 12345
            })
            .end(function(err, res) {
                var tempuser = res.body;

                assert.equal(res.status, 200);
                assert.deepEqual({
                    first_name: tempuser.first_name,
                    last_name: tempuser.last_name,
                    email: tempuser.email,
                    role: tempuser.role
                }, {
                    first_name: 'Test1',
                    last_name: 'Test1',
                    email: 'test123@t.t',
                    role: 'user'
                });

                superagent.del(API_ROOT + '/v1/classes/' + classes.id + '/users/' + tempuser.id)
                    .set('Authorization', user.token)
                    .end( (err, res) => {
                        assert.equal(res.status, 200);
                        done();
                    })
        });
    });
});

describe('v1/classes/:classId/courses - Course API', function() {
    it('Returns all courses connected to this class', function(done) {
        superagent.get(API_ROOT + '/v1/classes/' + _class.id + '/courses')
        .set('Authorization', user.token)
        .end(function(err, res) {
            var data = res.body;
            course = data[0];

            assert.equal(res.status, 200);

            data = _.map(data, (e) => {
                return {
                    name: e.name,
                    desc: e.desc,
                    episodes: e.episodes.length
                }
            })
            assert.deepEqual(data,[{
                name: 'Course 1',
                desc: 'Course description',
                episodes: 3
            }, {
                name: 'Course 2',
                desc: 'Course description',
                episodes: 1
            }]);

            done();
        });
    });

    it('Returns one course information within one class', function(done) {
        superagent.get(API_ROOT + '/v1/classes/' + _class.id + '/courses/' + course.id)
        .set('Authorization', user.token)
        .end(function(err, res) {
            var data = res.body;

            assert.equal(res.status, 200);

            data = {
                name: data.name,
                desc: data.desc,
                episodes: data.episodes.length
            }

            assert.deepEqual(data,{
                name: 'Course 1',
                desc: 'Course description',
                episodes: 3
            });

            done();
        });
    });

    it('Returns created course', function(done) {
        superagent.post(API_ROOT + '/v1/classes/' + _class.id + '/courses')
        .set('Authorization', user.token)
        .send({
            name: 'Course 4',
            desc: 'Math Course 4'
        })
        .end(function(err, res) {
            var data = res.body;

            assert.equal(res.status, 200);

            data = {
                name: data.name,
                desc: data.desc,
                episodes: data.episodes.length
            }

            assert.deepEqual(data,{
                name: 'Course 4',
                desc: 'Math Course 4',
                episodes: 0
            });

            done();
        });
    });
});

describe('v1/courses/:courseId/episodes - Episode API', function() {
    it('Returns all episodes in one course', function(done) {
        superagent.get(API_ROOT + '/v1/courses/' + course.id + '/episodes')
            .set('Authorization', user.token)
            .end(function(err, res) {
                var data = res.body;
                episode = data[0];

                assert.equal(res.status, 200);

                data = _.map(data, (e) => {
                    return {
                        name: e.name,
                        desc: e.desc,
                        scenes: e.scenes.length
                    }
                })

                assert.deepEqual(data, [{
                    name: 'Episode 1',
                    desc: 'Episode 1 description',
                    scenes: 2
                }, {
                    name: 'Episode 2',
                    desc: 'Episode 2 description',
                    scenes: 1
                }, {
                    name: 'Episode 3',
                    desc: 'Episode 3 description',
                    scenes: 1
                }]);

                done();
            });
    });

    it('Returns all episodes in one course with full task description', function(done) {
        superagent.get(API_ROOT + '/v1/courses/' + course.id + '/episodes/all')
        .set('Authorization', user.token)
        .end(function(err, res) {
            var data = res.body;

            assert.equal(res.status, 200);

            data = _.map(data, (e) => {
                return {
                    name: e.name,
                    desc: e.desc,
                    scenes: _.map(e.scenes, (e) => {
                        return {
                            name: e.name,
                            desc: e.desc,
                            tasks: e.tasks.length
                        }
                    })
                }
            })

            assert.deepEqual(data,[{
                name: 'Episode 1',
                desc: 'Episode 1 description',
                scenes: [{
                    name: 'Scene 1',
                    desc: 'Scene 1 description',
                    tasks: 2
                }, {
                    name: 'Scene 2',
                    desc: 'Scene 2 description',
                    tasks: 1
                }]
            }, {
                name: 'Episode 2',
                desc: 'Episode 2 description',
                scenes: [{
                    name: 'Scene 2',
                    desc: 'Scene 2 description',
                    tasks: 1
                }]
            }, {
                name: 'Episode 3',
                desc: 'Episode 3 description',
                scenes: [{
                    name: 'Scene 3',
                    desc: 'Scene 3 description',
                    tasks: 1
                }]
            }]);

            done();
        });
    });

    it('Returns one course information within one class', function(done) {
        superagent.get(API_ROOT + '/v1/courses/' + course.id + '/episodes/' + episode.id)
        .set('Authorization', user.token)
        .end(function(err, res) {
            var data = res.body;

            assert.equal(res.status, 200);

            data = {
                name: data.name,
                desc: data.desc,
                scenes: data.scenes.length
            }

            assert.deepEqual(data,{
                name: 'Episode 1',
                desc: 'Episode 1 description',
                scenes: 2
            });

            done();
        });
    });

    it('Returns created course', function(done) {
        superagent.post(API_ROOT + '/v1/courses/' + course.id + '/episodes')
        .set('Authorization', user.token)
        .send({
            name: 'New Episode',
            desc: 'New Episode description'
        })
        .end(function(err, res) {
            var data = res.body;

            assert.equal(res.status, 200);

            data = {
                name: data.name,
                desc: data.desc,
                scenes: data.scenes.length
            }

            assert.deepEqual(data,{
                name: 'New Episode',
                desc: 'New Episode description',
                scenes: 0
            });

            done();
        });
    });
});

describe('v1/episodes/:episodeId/scenes - Scene API', function() {
    it('Returns all scenes within one episode', function(done) {
        superagent.get(API_ROOT + '/v1/episodes/' + episode.id + '/scenes')
            .set('Authorization', user.token)
            .end(function(err, res) {
                var data = res.body;
                scene = data[0];

                assert.equal(res.status, 200);

                data = _.map(data, (e) => {
                    return {
                        name: e.name,
                        desc: e.desc,
                        tasks: e.tasks.length
                    }
                })

                assert.deepEqual(data, [{
                    name: 'Scene 1',
                    desc: 'Scene 1 description',
                    tasks: 2
                }, {
                    name: 'Scene 2',
                    desc: 'Scene 2 description',
                    tasks: 1
                }]);

                done();
            });
    });

    it('Returns one scene information within one episode', function(done) {
        superagent.get(API_ROOT + '/v1/episodes/' + episode.id + '/scenes/' + scene.id)
        .set('Authorization', user.token)
        .end(function(err, res) {
            var data = res.body;

            assert.equal(res.status, 200);

            data = {
                name: data.name,
                desc: data.desc,
                tasks: data.tasks.length
            }

            assert.deepEqual(data,{
                name: 'Scene 1',
                desc: 'Scene 1 description',
                tasks: 2
            });

            done();
        });
    });

    it('Returns created scene', function(done) {
        superagent.post(API_ROOT + '/v1/episodes/' + episode.id + '/scenes')
        .set('Authorization', user.token)
        .send({
            name: 'New Scene',
            desc: 'New Scene description'
        })
        .end(function(err, res) {
            var data = res.body;

            assert.equal(res.status, 200);

            data = {
                name: data.name,
                desc: data.desc,
                tasks: data.tasks.length
            }

            assert.deepEqual(data,{
                name: 'New Scene',
                desc: 'New Scene description',
                tasks: 0
            });

            done();
        });
    });
});

describe('v1/scenes/:sceneId/tasks - Task API', function() {
    it('Returns all tasks within one scene', function(done) {
        superagent.get(API_ROOT + '/v1/scenes/' + scene.id + '/tasks')
            .set('Authorization', user.token)
            .end(function(err, res) {
                var data = res.body;
                task = data[0];

                assert.equal(res.status, 200);

                data = _.map(data, (e) => {
                    return {
                        name: e.name,
                        desc: e.desc,
                        character: {
                            name: e.character.name,
                            desc: e.character.desc,
                            image: e.character.image ? 1 : 0
                        },
                        location: {
                            name: e.location.name,
                            desc: e.location.desc,
                            lon: e.location.lon,
                            lat: e.location.lat,
                            image: e.location.image ? 1 : 0
                        },
                    }
                })

                assert.deepEqual(data, [{
                    name: 'Task 1',
                    desc: 'Task 1 description',
                    character: {
                        name: 'Jack the officer',
                        desc: 'Good officer and policeman',
                        image: 1
                    },
                    location: {
                        name: 'NYPD',
                        desc: 'New York Police Department',
                        lon: 4.156,
                        lat: 2.687,
                        image: 1
                    }
                }, {
                    name: 'Task 2',
                    desc: 'Task 2 description',
                    character: {
                        name: 'Jack the officer',
                        desc: 'Good officer and policeman',
                        image: 1
                    },
                    location: {
                        name: 'Africa',
                        desc: 'Africa Police Department',
                        lon: 1.156,
                        lat: 4.687,
                        image: 1
                    },
                }]);

                done();
            });
    });

    it('Returns one task information within one scene', function(done) {
        superagent.get(API_ROOT + '/v1/scenes/' + scene.id + '/tasks/' + task.id)
        .set('Authorization', user.token)
        .end(function(err, res) {
            var data = res.body;

            assert.equal(res.status, 200);

            data = {
                name: data.name,
                desc: data.desc,
                character: {
                    name: data.character.name,
                    desc: data.character.desc,
                    image: data.character.image ? 1 : 0
                },
                location: {
                    name: data.location.name,
                    desc: data.location.desc,
                    lon: data.location.lon,
                    lat: data.location.lat,
                    image: data.location.image ? 1 : 0
                },
            }

            assert.deepEqual(data ,{
                name: 'Task 1',
                desc: 'Task 1 description',
                character: {
                    name: 'Jack the officer',
                    desc: 'Good officer and policeman',
                    image: 1
                },
                location: {
                    name: 'NYPD',
                    desc: 'New York Police Department',
                    lon: 4.156,
                    lat: 2.687,
                    image: 1
                }
            });

            done();
        });
    });

    var dueDate = Date.now();
    it('Returns created task', function(done) {
        superagent.post('http://localhost:3000/v1/scenes/' + scene.id + '/tasks')
        .set('Authorization', user.token)
        .send({
            name: 'New Task',
            desc: 'New Task description',
            dueDate: dueDate,
        })
        .end(function(err, res) {
            var data = res.body;

            assert.equal(res.status, 200);

            data = {
                name: data.name,
                desc: data.desc,
                character: data.character,
                location: data.location,
                dueDate: data.dueDate
            }

            assert.deepEqual(data, {
                name: 'New Task',
                desc: 'New Task description',
                character: {},
                location: {},
                dueDate: dueDate
            });

            done();
        });
    });

    it('Returns all tasks within one scene with new task', function(done) {
        superagent.get(API_ROOT + '/v1/scenes/' + scene.id + '/tasks')
            .set('Authorization', user.token)
            .end(function(err, res) {
                var data = res.body;
                task = data[0];

                assert.equal(res.status, 200);

                data = _.map(data, (e) => {
                    var character = {};
                    var location = {};

                    if(!_.isEmpty(e.character)) {
                        character = {
                            name: e.character.name,
                            desc: e.character.desc,
                            image: e.character.image ? 1 : 0
                        }
                    }

                    if(!_.isEmpty(e.location)) {
                        location = {
                            name: e.location.name,
                            desc: e.location.desc,
                            lon: e.location.lon,
                            lat: e.location.lat,
                            image: e.location.image ? 1 : 0
                        }
                    }

                    return {
                        name: e.name,
                        desc: e.desc,
                        character: character,
                        location: location,
                        dueDate: dueDate ? 1 : 0
                    }
                })

                assert.deepEqual(data, [{
                    name: 'Task 1',
                    desc: 'Task 1 description',
                    character: {
                        name: 'Jack the officer',
                        desc: 'Good officer and policeman',
                        image: 1
                    },
                    location: {
                        name: 'NYPD',
                        desc: 'New York Police Department',
                        lon: 4.156,
                        lat: 2.687,
                        image: 1
                    },
                    dueDate: 1
                }, {
                    name: 'Task 2',
                    desc: 'Task 2 description',
                    character: {
                        name: 'Jack the officer',
                        desc: 'Good officer and policeman',
                        image: 1
                    },
                    location: {
                        name: 'Africa',
                        desc: 'Africa Police Department',
                        lon: 1.156,
                        lat: 4.687,
                        image: 1
                    },
                    dueDate: 1
                }, {
                    name: 'New Task',
                    desc: 'New Task description',
                    character: {},
                    location: {},
                    dueDate: 1
                }]);

                done();
            });
    });
});

describe('v1/characters - Character API', function() {
    var testImage = fs.readFileSync(__dirname + '/util/default.png');

    it('Creates character and bind it to specific class and returns it\'s info', function(done) {
        superagent.post(API_ROOT + '/v1/characters/tasks/' + task.id)
            .set('Authorization', user.token)
            .field('name', 'Jackie')
            .field('desc', 'Jackie is a good character')
            .attach('image', __dirname + '/util/default.png')
            .end( (e, r) => {
                var data = r.body;

                assert.equal(r.status, 200);
                assert.deepEqual({
                    name: data.name,
                    desc: data.desc,
                    image: data.image ? 1 : 0
                }, {
                    name: 'Jackie',
                    desc: 'Jackie is a good character',
                    image: 1
                })

                done();
            });
    });

    it('Creates character and returns it\'s info', function(done) {
        superagent.post(API_ROOT + '/v1/characters')
            .set('Authorization', user.token)
            .field('name', 'Jane')
            .field('desc', 'Jane is a not good character')
            .attach('image', __dirname + '/util/default.png')
            .end( (e, r) => {
                var data = r.body;
                character = data;

                assert.equal(r.status, 200);
                assert.deepEqual({
                    name: data.name,
                    desc: data.desc,
                    image: data.image ? 1 : 0
                }, {
                    name: 'Jane',
                    desc: 'Jane is a not good character',
                    image: 1
                })

                done();
            });
    });

    it('Binds character to specific task', function(done) {
        superagent.post(API_ROOT + '/v1/characters/bind')
            .set('Authorization', user.token)
            .send({
                character_id: character.id,
                task_id: task.id,
            })
            .end( (e, r) => {
                assert.equal(r.status, 200);
                done();
            });
    });

    it('Returns all charaters from the system', function(done) {
        superagent.get(API_ROOT + '/v1/characters')
            .set('Authorization', user.token)
            .end(function(err, res) {
                var data = res.body;

                assert.equal(res.status, 200);

                var r = _.map(data, (e) => {
                    return {
                        name: e.name,
                        desc: e.desc,
                        image: e.image ? 1 : 0
                    }
                });

                assert.deepEqual(r, [{
                    name: 'Jack the officer',
                    desc: 'Good officer and policeman',
                    image: 1
                }, {
                    name: 'Jackie',
                    desc: 'Jackie is a good character',
                    image: 1
                }, {
                    name: 'Jane',
                    desc: 'Jane is a not good character',
                    image: 1
                }]);

                done();
            });
    });
})

describe('v1/locations - Location API', function() {
    it('Creates location and bind it to specific class and returns it\'s info', function(done) {
        superagent.post(API_ROOT + '/v1/locations/tasks/' + task.id)
            .set('Authorization', user.token)
            .field('name', 'Jackie')
            .field('desc', 'Jackie is a good character')
            .field('lon', 4.46452)
            .field('lat', 3.16846)
            .attach('image', __dirname + '/util/default.png')
            .end( (e, r) => {
                var data = r.body;

                assert.equal(r.status, 200);
                assert.deepEqual({
                    name: data.name,
                    desc: data.desc,
                    image: data.image ? 1 : 0,
                    lon: data.lon,
                    lat: data.lat
                }, {
                    name: 'Jackie',
                    desc: 'Jackie is a good character',
                    image: 1,
                    lon: 4.46452,
                    lat: 3.16846
                })

                done();
            });
    });

    it('Creates location and returns it\'s info', function(done) {
        superagent.post(API_ROOT + '/v1/locations')
            .set('Authorization', user.token)
            .field('name', 'Jane')
            .field('desc', 'Jane is a not good character')
            .field('lon', 4.46452)
            .field('lat', 3.16846)
            .attach('image', __dirname + '/util/default.png')
            .end( (e, r) => {
                var data = r.body;
                location = data;

                assert.equal(r.status, 200);
                assert.deepEqual({
                    name: data.name,
                    desc: data.desc,
                    image: data.image ? 1 : 0,
                    lon: data.lon,
                    lat: data.lat
                }, {
                    name: 'Jane',
                    desc: 'Jane is a not good character',
                    image: 1,
                    lon: 4.46452,
                    lat: 3.16846
                })

                done();
            });
    });

    it('Binds location to specific task', function(done) {
        superagent.post(API_ROOT + '/v1/locations/bind')
            .set('Authorization', user.token)
            .send({
                location_id: location.id,
                task_id: task.id,
            })
            .end( (e, r) => {
                assert.equal(r.status, 200);
                done();
            });
    });

    it('Returns all locations from the system', function(done) {
        superagent.get(API_ROOT + '/v1/locations')
            .set('Authorization', user.token)
            .end(function(err, res) {
                var data = res.body;

                assert.equal(res.status, 200);

                var r = _.sortBy(_.map(data, (e) => {
                    return {
                        name: e.name,
                        desc: e.desc,
                        image: e.image ? 1 : 0,
                        lon: e.lon,
                        lat: e.lat
                    }
                }), (e) => { return e.name} );

                assert.deepEqual(r, [{
                    name: 'Africa',
                    desc: 'Africa Police Department',
                    image: 1,
                    lon: 1.156,
                    lat: 4.687
                }, {
                    name: 'Bermuda triangle',
                    desc: 'Where ships dissapear',
                    image: 1,
                    lon: 32.3,
                    lat: 64.7833
                }, {
                    name: 'Jackie',
                    desc: 'Jackie is a good character',
                    image: 1,
                    lon: 4.46452,
                    lat: 3.16846
                }, {
                    name: 'Jane',
                    desc: 'Jane is a not good character',
                    image: 1,
                    lon: 4.46452,
                    lat: 3.16846
                }, {
                    name: 'Japanece chinatown',
                    desc: 'Best food',
                    image: 1,
                    lon: 10.456,
                    lat: 3.687
                }, {
                    name: 'NYPD',
                    desc: 'New York Police Department',
                    image: 1,
                    lon: 4.156,
                    lat: 2.687
                }, {
                    name: 'Stonehenge',
                    desc: 'Stone rock stonehenge',
                    image: 1,
                    lon: 51.1788,
                    lat: 1.8262
                }]);

                done();
            });
    });
})

describe('v1/user - User API', function() {
    it('Returns logged user information', function(done) {
        superagent.get(API_ROOT + '/v1/user')
            .set('Authorization', user.token)
            .end(function(err, res) {
                assert.equal(res.status, 200);
                assert.deepEqual({
                    first_name: user.first_name,
                    last_name: user.last_name,
                    email: user.email,
                    role: user.role
                }, {
                    first_name: 'Test',
                    last_name: 'Teacher',
                    email: 'testteacher@ex.com',
                    role: 'teacher'
                });

                done();
            });
    });

    it('Uploads test image for current user', function(done) {
        superagent.post(API_ROOT + '/v1/image/')
            .set('Authorization', user.token)
            .attach('image', __dirname + '/util/default.png')
            .end( (e, r) => {
                assert.equal(r.status, 200);
                done();
            });
    });

    it('Uploads test image for current user', function(done) {
        superagent.get(API_ROOT + '/v1/image/user/' + user.id)
            .set('Authorization', user.token)
            .end( (e, r) => {
                assert.equal(r.status, 200);
                assert.equal(r.headers['content-type'], 'image/png');
                assert.equal(r.headers['content-length'], testImage.length);
                assert.deepEqual(r.body, testImage);

                done();
            });
    });
});
