var _ = require('underscore');
var config = require('../../config');
var idValidation = require('../util/middleware').idValidation;
var HttpError = require('../util/middleware').HttpError;
var user = require('../database/user');
var gcm = require('node-gcm');

// init sender
var sender;

if(config.GCM_SERVER_API_KEY && config.GCM_PROJECT_NUMBER) {
    sender = new gcm.Sender(config.GCM_SERVER_API_KEY);
} else {
    console.error('GCM_PROJECT_NUMBER or GCM_SERVER_API_KEY is not present. Can\'t use android push notifications');
}

/**
* Returns Google Project Id
*/
function getProjectId(req, res, done) {
    if(!config.GCM_PROJECT_NUMBER) return done(new HttpError(400, 'There is no project configured'));

    res.send({
        projectNumber: config.GCM_PROJECT_NUMBER
    })
}

/**
* Saves android registration ID
*/
function saveRegistrationId(req, res, done) {
    var params = {
        userId: req.user._id,
        deviceRegistrationId: req.body.registrationId,
    };

    user.saveDeviceRegistrationId(params, (e, r) => {
        if(e) return done(new HttpError(500, e));
        if(!r) return done(new HttpError(400, 'Can not save device registration id'));

        res.send();

        sendPushToDevice(params.deviceRegistrationId, {
            'success': 'Success! Your device is linked to app'
        });
    })
}

/**
* Sends push to specific device
*/
function sendPushToDevice(deviceId, data, done) {
    if(!done) done = (e, r) => {};

    if(!sender) return done({
        error: 'Google push notifications are not enabled'
    })

    if(!deviceId) return done({
        error: 'Device id shoud be present'
    })

    var message = new gcm.Message();

    message.addData(data);

    var regIds = [deviceId];

    sender.send(message, regIds, function (err, res) {
        if(err) done(err);
        else done(null, res);
    });
}

/**
* Sends push notification when new data is added
*/
function dataChangedPush(data, done) {
    user.findDeviceIds( (e, r) => {
        if(e) return done(e);

        _.each(r, (e) => {
            sendPushToDevice(e.deviceRegistrationId, data, done)
        })
    })
}

module.exports = {
    getProjectId: getProjectId,
    saveRegistrationId: saveRegistrationId,
    sendPushToDevice: sendPushToDevice,
    dataChangedPush: dataChangedPush
};
