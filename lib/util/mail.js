var config = require('../../config');

var valid = true;
if(!config.SENDGRID_API_KEY) {
    console.log('Sendgrid service is unavailable due to missing SENDGRID_API_KEY');
    valid = false;
}

if(!config.SENDGRID_SENDER) {
    console.log('Sendgrid service is unavailable due to missing SENDGRID_SENDER');
    valid = false;
}

var sendgrid = require('sendgrid')(config.SENDGRID_API_KEY);

/**
* Sends mail to user
* @param {to, from, subject, text}
*/
function send(payload, done) {
    if(sendgrid && valid) {
        if(!payload.from) payload.from = config.SENDGRID_SENDER;
        sendgrid.send(payload, done);
    } else {
        console.log('Mail service is unavailable');
    }
}

module.exports = {
    send: send
}
