var revalidator = require('revalidator');
var idValidation = require('./middleware').idValidation;
var HttpError = require('./middleware').HttpError;
var _ = require('underscore');
var colors = require('colors');

/**
* Validates json,
* validates access rights
* and everything is ok -> runs next function
*
* module.exports = ([], done)
* module.exports = ({}, done)
* module.exports = ({}, [], done)
*/
function validate(schema, rights, done) {
    return (req, res, next) => {
        // validate json data
        if (schema && typeof(schema) === 'object') {
            try {
                var result = revalidator.validate(req.body, schema);
                if (!result.valid) {
                    message = [
                        result.errors[0].property,
                        result.errors[0].message
                    ].join(' ');

                    return next(new HttpError(400, message));
                }
            } catch(ex) {
                return next(new HttpError(400, 'Bad message format'));
            }
        }

        // validate user access rights
        if(schema && Array.isArray(schema)) {
            if(!req.user) {
                return next(new HttpError(401, 'Insufficent permissions'));
            }

            var access = _.some(schema, (e) => {
                return e === req.user.role;
            });

            if(access) return rights(req, res, next);
            else {
                return next(new HttpError(401, 'Insufficent permissions'));
            }
        }

        if(rights && Array.isArray(rights)) {
            if(!req.user) {
                next(new HttpError(401, 'Insufficent permissions'));
            }

            var access = _.some(rights, (e) => {
                return e === req.user.role;
            });

            if(access) return done(req, res, next);
            else {
                return next(new HttpError(401, 'Insufficent permissions'));
            }
        }

        return rights(req, res, next)
    }
}

/**
 *
 * @param v { schema, rights, ids }
 * @param done
 * @returns {Function}
 */
module.exports = (v, done) => {
    if(!_.isObject(v)) throw 'Validation argument should be an object!';
    if(!done) {
        throw 'Done callback should exist!';
        console.trace()
    }

    return (req, res, next) => {
        // validate json data
        if (v.schema) {
            try {
                var result = revalidator.validate(req.body, v.schema);
                if (!result.valid) {
                    message = [
                        result.errors[0].property,
                        result.errors[0].message
                    ].join(' ');

                    return next(new HttpError(400, message));
                }
            } catch(ex) {
                return next(new HttpError(400, 'Bad message format'));
            }
        }

        // validate user access rights
        if(v.rights) {
            if(!req.user) {
                return next(new HttpError(401, 'Insufficent permissions'));
            }

            var access = _.some(v.rights, (e) => {
                return e === req.user.role;
            });

            if(!access) return next(new HttpError(401, 'Insufficent permissions'));
        }

        // validate ids
        if(v.ids) {
            //if(_.isObject(v.ids)) throw 'Ids should be array not object!: ' + v.ids;
            if(!_.isArray(v.ids)) v.ids = [ v.ids ];
            var ids = _.chain(v.ids)
                        .map((e) => {
                            if(req.params[e]) return req.params[e];
                            if(req.body[e]) return req.body[e];
                            return false;
                        })
                        .flatten()
                        .value();

            // TODO delete later
            //console.log('ids', ids);

            if(ids.length == 0) return done(req, res, next);

            var valid = idValidation( ids );
            if(!valid.valid) return next(new HttpError(400, valid.errors));
        }

        return done(req, res, next)
    }
}
