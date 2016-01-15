var validate = require('./lib/util/validator');
var admin = require('./lib/admin');

module.exports = function(app) {
    app.get('/v1/admin/users', admin.getAllUsers);
    app.get('/v1/admin/users/:userId', admin.getUserById);
    app.post('/v1/admin/users', admin.createUser);
    app.put('/v1/admin/users/:userId', admin.updateUser);
    app.delete('/v1/admin/users/:userId', admin.removeUserByAdmin);

    app.get('/v1/admin/classes', admin.getAllClasses);
    app.get('/v1/admin/classes/:classId', admin.getClassById);
    app.post('/v1/admin/classes', admin.createClass);
    app.put('/v1/admin/classes/:classId', admin.updateClass);
    app.delete('/v1/admin/classes/:classId', admin.removeClass);

    app.get('/v1/admin/courses', admin.getAllCourses);
    app.get('/v1/admin/courses/:courseId', admin.getCourseById);
    app.post('/v1/admin/courses', admin.createCourse);
    app.put('/v1/admin/courses/:courseId', admin.updateCourse);
    app.delete('/v1/admin/courses/:courseId', admin.removeCourse);

    app.get('/v1/admin/episodes', admin.getAllEpisodes);
    app.get('/v1/admin/episodes/:episodeId', admin.getEpisodeById);
    app.post('/v1/admin/episodes', admin.createEpisode);
    app.put('/v1/admin/episodes/:episodeId', admin.updateEpisode);
    app.delete('/v1/admin/episodes/:episodeId', admin.removeEpisode);

    app.get('/v1/admin/scenes', admin.getAllScenes);
    app.get('/v1/admin/scenes/:sceneId', admin.getSceneById);
    app.post('/v1/admin/scenes', admin.createScene);
    app.put('/v1/admin/scenes/:sceneId', admin.updateScene);
    app.delete('/v1/admin/scenes/:sceneId', admin.removeScene);

    app.get('/v1/admin/tasks', admin.getAllTasks);
    app.get('/v1/admin/tasks/:taskId', admin.getTaskById);
    app.post('/v1/admin/tasks', admin.createTask);
    app.put('/v1/admin/tasks/:taskId', admin.updateTask);
    app.delete('/v1/admin/tasks/:taskId', admin.removeTask);

     //app.get('/v1/admin/character', admin.getAllCharacters);
     //app.get('/v1/admin/character/:character', admin.getCharacterById);
     //app.post('/v1/admin/character', admin.createCharacter);
     //app.put('/v1/admin/character/:characterId', admin.updateCharacter);
     //app.delete('/v1/admin/character/:characterId', admin.removeCharacter);
     //
    // app.get('/v1/admin/location', admin.getAllLocations);
    // app.post('/v1/admin/location', admin.createLocation);
    // app.put('/v1/admin/location/:taskId', admin.updateLocation);
    // app.delete('/v1/admin/location/:taskId', admin.removeLocation);
}
