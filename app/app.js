var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');


var mongoose = require('mongoose');
var session = require('express-session');
var passport = require('passport');
var flash = require('connect-flash');
var validator = require('express-validator');
var MongoStore = require('connect-mongo')(session);
//mongodb://admin:SaludPrimero@ds153835.mlab.com:53835/saludprimero30
//'mongodb://admin:oscarpol@ds161295.mlab.com:61295/practicanode'
mongoose.connect('mongodb://admin:SaludPrimero@ds153835.mlab.com:53835/saludprimero30', function(err){
  if(err){
    console.log("connection error");
  }else{
    console.log("connection succesful");
  }
});
require('./config/passport');



var routes = require('./routes/index');
var users = require('./routes/user');
var dash = require('./routes/dashboard');
var client = require('./routes/usuario');
var operator = require('./routes/operario');
var lab = require('./routes/laboratorista');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(validator());
app.use(cookieParser());

//oscar
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({ mongooseConnection: mongoose.connection }),
  cookie: { maxAge: 180 * 60 * 1000}
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
//oscar

app.use(express.static(path.join(__dirname, 'public')));

/*
// Make our db accessible to our router
app.use(function(req,res,next){
    req.db = db;
    next();
});
*/

//oscar, access to db, no en memoria, metodo optimo
app.use(function (req, res, next) {
  res.locals.login = req.isAuthenticated();
  res.locals.session = req.session;
  next();
});
//oscar

app.use('/', routes);
app.use('/user', users);
app.use('/dashboard', dash);
app.use('/usuario', client);
app.use('/operario', operator);
app.use('/laboratorista', lab);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
