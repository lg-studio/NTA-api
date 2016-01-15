var config = require('../../config');
var mongoose = require('mongoose');

var log = '';
if(process.env.NODE_ENV == 'test') {
    mongoose.connect(config.MONGODB_TEST);
    log = 'test';
} else if(process.env.NODE_ENV == 'dev') {
    mongoose.connect(config.MONGODB_DEV);
    log = 'development';
} else {
    mongoose.connect(config.MONGODB);
    log = 'production';
} 

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
    console.log('Connection to Mongodb opened successfully: ' + log);
});

module.exports = mongoose;
