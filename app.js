var bodyParser = require('body-parser');
var package = require('./package.json');
var express = require('express');
var config = require('./config');
var morgan = require('morgan');
var adminRoutes = require('./adminRoutes');
var userRoutes = require('./userRoutes');
var middleware = require('./lib/util/middleware');
var passport = require('./lib/passport');
var helmet = require('helmet');
var colors = require('colors');

var app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

morgan.token('body', middleware.body);

if(process.env.NODE_ENV != 'test') {
    app.use(morgan(':method :url :status :res[content-length] - :response-time ms '));
}

app.use( (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    next();
});

app.use(helmet());

// initialize passport
// passport(app);

// gets auth header and attaches it to req
app.use( middleware.authorization );

// send server api version
app.get('/', (req, res) => {
    res.send({
        api: package.version
    });
});

// rest api endpoints
adminRoutes(app);
userRoutes(app);

if(process.env.NODE_TEST_API === 'true') {
    console.log('Using test api endpoints')
    require('./testapi')(app)
}

// system error handler
//if(process.env.NODE_ENV == 'prod') {
app.use((err, req, res, next) => {
    if (err) {
        if (err instanceof middleware.HttpError) {
            if (err.status == 500) {
                console.error(err);
                return res.status(err.status).send()
            } else if (err.message) {
                return res.status(err.status).send({
                    error: err.message
                })
            } else {
                return res.status(err.status).send()
            }
        } else if (err.status && err.status != 500) {
            console.error(err);
            return res.status(err.status).send({
                message: err.message,
                error: err.body
            })
        } else {
            console.error(err);
            console.trace();
            return res.status(500).send({
                error: "Internal server exception"
            });
        }
    }
})


// start the server
var server = app.listen(config.PORT, () => {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Server listening at http://%s:%s', host, port);
});

process.on('SIGINT', function() {
    // calling shutdown allows your process to exit normally
    process.exit();
});
