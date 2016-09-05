var express = require('express');
var router = express.Router();
var passport = require('passport');
var Examen = require('../models/modExamen.js');
var Muestra = require('../models/muestra.js');

router.get('/logout', isLoggedIn,function (req, res, next) {
    req.logout();
    res.redirect('/user/signin');
});


router.get('/', isLoggedIn, function(req, res, next) {
    console.log(req.isAuthenticated() +  ' :valor');
    res.render('laboratorista/homeLab', { title: 'Bienvenido' });

});

router.get('/recepcion-muestras',isLoggedIn, function(req, res, next) {
    Muestra.find({estado: "Pendiente"},function(err, list){
    res.render('laboratorista/recepcion_muestra', { 
      title: 'Recepcion de Muestras', 
      muestras: list
    });
  }); 
});

router.post('/recepcion-muestras/notificar',isLoggedIn, function(req, res, next) {
   //Hay que cambiar el estado de la muestra que tenga ese codigo por "Cancelada"
   console.log("notificando "+req.body.codigo);
   Muestra.findOne({codigo:req.body.codigo}).exec(function (err,muestra){
      if (err) return handleError(err);
      muestra.estado = 'Cancelado';
      muestra.save();
   });
   //res.redirect('/laboratorista/recepcion-muestras');
});

router.post('/recepcion-muestras/recibir',isLoggedIn, function(req, res, next) {
   //Hay que cambiar el estado de la muestra que tenga ese codigo por "Cancelada"
   console.log("recibido "+req.body.codigos);
   Muestra.findOne({codigo:req.body.codigo}).exec(function (err,muestra){
      if (err) return handleError(err);
      muestra.estado = 'En Espera';
      muestra.save();
   });
});


router.get('/ingreso-resultados', isLoggedIn, function(req, res, next) {
    Muestra.find({estado: "En Espera"},function(err, list){
    res.render('laboratorista/ingreso_resultados', { 
      title: 'Ingreso de Resultados de Muestras', 
      muestras: list
    });
  }); 
});

router.post('/ingreso-resultados/examenes', isLoggedIn, function(req, res, next) {
    var examenes = req.body.examenes;
    console.log("codigo: " + req.body.codigo);
    Muestra.find({codigo:req.body.codigo}).exec(function (err,muestra){
      if (err) return handleError(err);
      muestra.forEach(function(mus){
          var json = JSON.parse(examenes);
          console.log(json);
          mus.examenes = json;
          mus.estado = 'Listo';
          mus.save();
      });
    });
});

router.use('/', notLoggedIn, function (req, res, next) {
    next();
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated() && req.session.rol === "laboratorista" ){
        return next();
    }
    console.log('sesion del laboratorista, no tiene permiso');
    req.logout();
    res.redirect('/user/signin');
}


function notLoggedIn(req, res, next) {
    if (!req.isAuthenticated()){
        return next();
    }
    req.logout();
    res.redirect('/user/signin');
}

module.exports = router;