var passport = require('passport');
var localStrategy = require('passport-local')
var session = require('express-session');

// initialize passport middleware
module.exports = function(app) {
    // app.use(session( { secret: 'hello-world' } ))
    app.use(passport.initialize())
    // app.use(passport.session())

    passport.serializeUser( (user, done) => {
        console.log('serialize', user)
        done(null, user);
    })

    passport.deserializeUser( (user, done) => {
        console.log('deserialize', user)
        done(null, user);
    })

    passport.use('local-register', new localStrategy.Strategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true,
        session: false
    }, function(req, email, password, done) {

        // find if user already exists
        var user = _.find(users, (e) => {
            return e.email === email;
        })

        if(user) return done(null, false, 'user exists');

        var o = {
            email: email,
            password: password,
            isLogged: true
        }
        // else pass
        users.push(o)

        done(null, o)
    }) )

    passport.use('local-login', new localStrategy.Strategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true,
        session: false
    }, function(req, email, password, done) {

        // find if user already exists
        var user = _.find(users, (e) => {
            return e.email === email;
        })

        if(user) return done(null, user);

        done(null, false)
    }) )
}

// routing example 
// app.post('/register', register)
// app.post('/login', passport.authenticate('local-login'), login)
// app.get('/profile', isLoggedIn, profile)
