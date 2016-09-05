var passport = require('passport');
var User = require('../models/user_login');
var LocalStrategy = require('passport-local').Strategy;

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});

passport.use('local.signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, function (req, email, password, done) {
    req.checkBody('email', 'Invalid Email').notEmpty().isEmail();
    req.checkBody('password', 'Invalid password').notEmpty().isLength({min:4});
    var errors = req.validationErrors();
    if(errors){
        var messages = [];
        console.log("holi error");
        errors.forEach(function (error) {
            messages.push(error.msg);
        });
        return done(null, false, req.flash('error', messages));
    }

    User.findOne({'email': email}, function (err, user) {
        if(err){
            return done(err);
        }
        if(user){
            return done(null, false, {message: 'Email is already in use'});
        }
        var newUser = new User();
        newUser.email = email;
        newUser.password= newUser.encryptPassword(password);
        newUser.rol = req.param('rol');
        newUser.save(function (err, result) {
            if(err){
                return done(err);
            }
            return done(null, newUser);
        });
    });
}));

passport.use('local.signin', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
},function (req, email, password, done) {
    console.log(req.param('rol'));
    req.checkBody('email', 'Invalid Email').notEmpty().isEmail();
    req.checkBody('password', 'Invalid password').notEmpty();
    var errors = req.validationErrors();
    if(errors){
        var messages = [];
        console.log("holi signin");
        errors.forEach(function (error) {
            messages.push(error.msg);
        });
        return done(null, false, req.flash('error', messages));
    }

    User.findOne({'email': email}, function (err, user) {
        console.log("find email" + email);
        if(err){
            return done(err);
        }
        if(!user){
            return done(null, false, {message: 'NO user found'});
        }
        if(!user.validPassword(password)){
            return done(null, false, {message: 'wrong password'});
        }
        if(user.rol != req.param('rol')){
            return done(null,false, {message: 'Wrong rol'});
        }
        return done(null, user);
    });
}));