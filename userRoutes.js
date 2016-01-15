var middleware = require('./lib/util/middleware');
var api = require('./lib');
var stats = require('./lib/stats');

function stub(req, res) { res.status(400).send('Temporary unavailable'); }

module.exports = function(app) {
    app.post('/v1/register', api.register);
    app.post('/v1/login', api.login);
    app.post('/v1/logout', api.logout);

    app.post('/v1/feedback', api.sendFeedback);

    // android push keys handshake
    app.get('/v1/push', api.getProjectId);
    app.post('/v1/push', api.saveRegistrationId);

    // forgot password
    app.post('/v1/password/change', api.changePassword);
    app.post('/v1/password/reset', api.resetPassword); // 1
    app.post('/v1/password/save', api.saveNewPassword);
    app.post('/v1/password/reset/:token', api.checkToken);

    // classes
    app.get('/v1/classes', api.getClasses);
    app.get('/v1/classes/:classId', api.getClassById);

    // TODO change api later
    app.post('/v1/classes', api.createClass);

    // class
    app.get('/v1/classes/:classId/users', api.getClassUsers);
    // app.delete('/v1/classes/:classId/users/:userId', api.removeUserFromClass);

    // 
    // app.get('/v1/course/:courseId', api.getCourse);
    app.get('/v1/episode/:episodeId', api.getEpisode);
    app.get('/v1/scene/:sceneId', api.getScene);
    app.get('/v1/task/:taskId', api.getTask);    

    // courses
    app.get('/v1/classes/:classId/courses', api.getCourses);
    app.get('/v1/classes/:classId/courses/:courseId', api.getCourseById);
    app.post('/v1/classes/:classId/courses', api.createCourse);

    // episodes
    app.get('/v1/courses/:courseId/episodes', api.getEpisodes);
    app.get('/v1/courses/:courseId/episodes/:episodeId', api.getEpisodeById);
    app.get('/v1/courses/:courseId/episodesAll', api.getEpisodesAll);
    app.post('/v1/courses/:courseId/episodes', api.createEpisode);

    // scenes
    app.get('/v1/episodes/:episodeId/scenes', api.getScenes);
    app.get('/v1/episodes/:episodeId/scenes/:sceneId', api.getSceneById);
    app.post('/v1/episodes/:episodeId/scenes', api.createScene);

    app.post('/v1/scenes/:sceneId/image', api.attachImageToScene);

    // tasks
    app.get('/v1/scenes/:sceneId/tasks', api.getTasks);
    app.get('/v1/scenes/:sceneId/tasksfordevice', api.getTasksForUser);
    app.get('/v1/scenes/:sceneId/tasks/:taskId', api.getTaskById);
    app.get('/v1/scenes/:sceneId/tasks/:taskId/my', api.getTaskByIdForUser);
    app.post('/v1/scenes/:sceneId/tasks', api.createTask);

    // characters
    app.get('/v1/characters', api.getAllCharacters);
    app.get('/v1/characters/:characterId', api.getCharacterById);
    app.post('/v1/characters', api.createCharacter);
    app.put('/v1/characters/:characterId', api.updateCharacter);
    app.delete('/v1/characters/:characterId', api.removeCharacter);

    //
    //app.post('/v1/characters/bind', api.bindCharacterToTask);
    //app.post('/v1/characters/tasks/:taskId', api.createCharacterForTask);

    // locations
    app.get('/v1/locations', api.getAllLocations);
    app.get('/v1/locations/:locationId', api.getLocationById);
    app.post('/v1/locations', api.createLocation);
    app.put('/v1/locations/:locationId', api.updateLocation);
    app.delete('/v1/locations/:locationId', api.removeLocation);
    //app.post('/v1/locations/bind', api.bindLocationToTask);
    //app.post('/v1/locations/tasks/:taskId', api.createLocationForTask);

    // user
    app.get('/v1/user', api.getLoggedUser);
    app.get('/v1/user/:userId', api.getUserById);
    app.get('/v1/user/:userId/tasklog', stats.getTasklogForUser);
    //app.get('/v1/user_image/:userId', api.getUserById);

    // images
    app.post('/v1/image', api.uploadImage);
    //app.get('/v1/image/:imageId', api.getImageById);
    //app.get('/v1/image/user/:userId', api.getImage);

    // get images for entities
    app.get('/v1/image/user/:userId', api.getImageForUser);
    app.get('/v1/image/episode/:episodeId', api.getImageForEpisode);
    app.get('/v1/image/scene/:sceneId', api.getImageForScene);
    app.get('/v1/image/task/:taskId', api.getImageForTask);
    //app.get('/v1/image/task/:taskId/character', api.getCharacterForTask);
    //app.get('/v1/image/task/:taskId/location', api.getLocationForTask);
    app.get('/v1/image/location/:locationId', api.getImageForLocation);
    app.get('/v1/image/character/:characterId', api.getImageForCharacter);

    // mediabank
    app.get('/v1/mediabank', api.getMediabank);
    app.get('/v1/mediabank/:mediaId', api.getMediabankItem);
    app.post('/v1/mediabank', api.createMediabankItem);
    app.put('/v1/mediabank/:mediaId', api.updateMediabankItem);
    app.delete('/v1/mediabank/:mediaId', api.removeMediabankItem);

    // audio
    app.get('/v1/audio/:audioId', api.getAudio);
    app.post('/v1/audio/:audioId', api.uploadAudio);

    // tasklog
    app.get('/v1/tasklog', stats.getTasklog);
    app.post('/v1/tasklog', stats.logTask);
};
