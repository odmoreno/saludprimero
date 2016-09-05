var express = require('express');
var router = express.Router();
//oscar
var csrf = require('csurf');
var passport = require('passport');

var csrfProtection = csrf();
router.use(csrfProtection);

router.get('/profile', isLoggedIn, function (req, res, next) {
  res.render('user/profile');
});

router.get('/logout', isLoggedIn,function (req, res, next) {
  req.logout();
  res.redirect('/');
});

router.use('/', notLoggedIn, function (req, res, next) {
  next();
});

router.get('/signup', function (req, res, next) {
  var messages = req.flash('error');
  res.render('user/signup', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0});
});


router.post('/signup', passport.authenticate('local.signup', {
  successRedirect: '/user/profile',
  failureRedirect: '/user/signup',
  failureFlash: true
}));

router.get('/signin', function (req, res, next) {
  var messages = req.flash('error');
  res.render('user/signin', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0});
});


router.post('/signin', passport.authenticate('local.signin', {
  //successRedirect: '/user/profile',
  failureRedirect: '/user/signin',
  failureFlash: true
}), function (req, res) {
  //console.log("normal: " + req.session["rol"]);

  if (req.param('rol') === 'cliente'){
    req.session.rol = "cliente";
    console.log("session rol: " + req.session.rol);
    console.log('vista clientes');
    req.session['email'] = req.param('email');//este parametro se utiliza para cargar la informacion del usuario segun la sesion
    res.redirect('/usuario');
  }
  else if (req.param('rol') === 'operario'){
    req.session.rol = "operario";
    console.log("session rol: " + req.session.rol);
    console.log('vista operarios');
    res.redirect('/operario');
  }
  else {
    req.session.rol = "laboratorista";
    console.log("session rol: " + req.session.rol);
    console.log('vista laboratorista');
    res.redirect('/laboratorista');
  }
});


function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()){
    return next();
  }
  console.log('No ha iniciado sesion, no puede ingresar');
  res.redirect('/');
}


function notLoggedIn(req, res, next) {
  if (!req.isAuthenticated()){
    return next();
  }
  console.log('sesion activa ...debe salir');
  res.redirect('/');
}


module.exports = router;
