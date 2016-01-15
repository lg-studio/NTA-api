var mail = require('../util/mail');
var config = require('../../config')
/**
* Sends mail with feedback from user
*/
function sendFeedback(req, res, done) {
    var message = {
        to: config.FEEDBACK_MAIL,
        from: req.body.from,
        subject: req.body.subject,
        text: req.body.text
    }

    mail.send(message, (e, r) => {
        if(e) return done(new HttpError(500, e));
        if(!r) return done(new HttpError(400, 'Some error when sending feedback'));

        res.send();
    })
}

module.exports = {
    sendFeedback: sendFeedback
}