var user = require('../database/user');
var util = require('util');
var _ = require('underscore');
var colors = require('colors');

var exceptionRoutes = [ /^\/$/, /^\/favicon.ico$/, /^\/v1\/register$/, /^\/v1\/login$/, 
                        /^\/v1\/password\/reset$/, /^\/v1\/password\/reset\/.*$/, /^\/v1\/password\/save$/,
                        /^\/v1\/feedback$/   ];
var mediabankRoutes = [ /^\/v1\/image\/.*$/, /^\/v1\/image\/user\/.*$/, /^\/v1\/audio\/.*$/, 
                        /^\/v1\/mediabank$/, /^\/v1\/mediabank\/.*$/ ];

function authorization(req, res, next) {
    var params = {
        token: req.headers.authorization
    };

    if(req.method === 'OPTIONS') return res.send();

    // validate routes which can be accessed without login
    if( _.find(exceptionRoutes, (e) => { return req.url.match(e) }) ) {
        next();
    } else if( _.find(mediabankRoutes, (e) => { return req.url.match(e)} )) {
        user.findUserByToken(req.headers.authorization, (e, r) => {
            if(e) return next(new HttpError(500, e));

            if(r) {
                req.user = r;
                req.owner = (r.role === 'admin') ? 'admin' : r._id;
            }
            next();
        })
    } else {
        if(!params.token) {
            return next(new HttpError(401, 'Insufficient Permissions'));
        }

        user.findUserByToken(req.headers.authorization, (e, r) => {
            if(e) return next(new HttpError(500, e));

            if(r) {
                req.user = r;
                req.owner = (r.role === 'admin') ? 'admin' : r._id;
                return next();
            } else {
                return next(new HttpError(401, 'Insufficient Permissions'));
            }
        })
    }
}

function body(req, res, next) {
    return JSON.stringify(req.body, null, 4);
}

/**
 * Ids in mongo should be 24 chars long
 * values should be array
 */
function idValidation(values, next) {
    if(!Array.isArray(values)) {
        values = [values];
        //throw new Error('values should be array!');
        console.error('values should be array!'.red)
    }

    var o = {
        valid: false,
        errors: []
    };

    values = _.filter(values, (e) => { return !!e } );

    o.valid = _.every(values, (e) => {
        if(e && e.length === 24) return true;
        else {
            o.errors.push('Id ' + e + ' is not valid');
            return false;
        }
    });

    return o;
}

// HttpError
function HttpError(status, message) {
    this.status = status;
    this.message = message;
}

util.inherits(HttpError, Error);
HttpError.prototype.name = 'HttpError';

module.exports = {
    body: body,
    authorization: authorization,
    idValidation: idValidation,
    HttpError: HttpError
};
