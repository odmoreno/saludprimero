var express = require('express');
var router = express.Router();
var passport = require('passport');
var Centro = require('../models/modCentro');
var Examen = require('../models/modExamen.js');
var UserInfo = require('../models/modUsuario.js');
var usuarioLog = require('../models/user_login');

var paciente = require('../models/paciente');

router.get('/logout', isLoggedIn, function (req, res, next) {
    req.logout();
    res.redirect('/user/signin');
});



//vistas usuario
router.get('/', isLoggedIn, function(req, res, next) {
    console.log(req.isAuthenticated() +  ' :valor');
    res.render('usuario/home', { title: 'Bienvenido' });


});

router.get('/perfil', isLoggedIn, function(req, res, next) {

    usuarioLog.findOne({ email : req.session['email']})
        .populate('paciente')
        .exec(function (err, user) {
            if (err) return handleError(err);
            res.render('usuario/perfil_user',{
                title: 'Mi Perfil',
                paciente : user.paciente,
                usuario : user
            });
        });

    /*UserInfo.find({email:req.session['email']},{},function(e,userinf){//aqui se debe hacer el query para seleccionar solo la info del usuario que esta en sesion

        res.render('usuario/perfil_user',{
            title: 'Mi Perfil',
            usuarioInfoList : userinf
        });
    });*/
});

router.post('/perfil/editUser', function(req, res, next) {
        usuarioLog.findOne({ email : req.session['email']})
            .populate('paciente')
            .exec(function (err, user) {
                if (err) return handleError(err);
                user.paciente.nombres =req.body.nombres;
                user.paciente.apellidos =req.body.apellidos;
                user.paciente.cedula =req.body.cedula;
                user.email = req.body.email;
                user.paciente.direccion =req.body.direccion;
                user.paciente.telefonos =req.body.telefono;
                user.paciente.save();
                user.save();
                res.redirect('/usuario/perfil');
            })
        //res.redirect('/usuario/perfil');
}, function (err) {
        res.redirect('/usuario/perfil');
    }
    /*UserInfo.update({email:req.session['email']}, {
      nombres: req.body.nombres,
      apellidos: req.body.apellidos,
      cedula: req.body.cedula,
      email: req.body.email,
      dir: req.body.direccion,
      telf: req.body.telefono
    },
    function(err){
      res.redirect('/usuario/perfil');
    });*/
);

router.post('/perfil/newPass', function(req, res, next){
    //res.send(req.body.newpassword1);
    if (req.body.newpassword1 === req.body.newpassword2){//chequeo que la nueva contrasena y su validacion sean iguales
      usuarioPrueba = new usuarioLog({password:req.body.newpassword1});
      usuarioPrueba.password = usuarioPrueba.encryptPassword(usuarioPrueba.password);
      usuarioLog.findOne({email:req.session['email']}).exec(function (err, user){
        if (err) return handleError(err);
        user.password = usuarioPrueba.password;
        user.save();
        console.log(user.password);
        console.log(usuarioPrueba.password);
      });
     
    res.redirect('/usuario/perfil');
    return;
    }res.send('Las contrasenas ingresadas no son iguales');
    
});

router.get('/examenes', isLoggedIn, function(req, res, next) {

    usuarioLog.findOne({ email : req.session['email']})
        .populate({path: 'paciente', populate: {path: 'muestras'}})
        .exec( function (err, user) {
            /*console.log("------");
            console.log(user.paciente.muestras);
            console.log("------");
            console.log(user.paciente.muestras[0]);
            console.log("------");
            console.log(user.paciente.muestras[0].examenes);*/
            res.render('usuario/examenes_user' , {title: 'Mis Examenes',
                examenes: user.paciente.muestras ,
                hasExam: user.paciente.muestras.length > 0
            });
        });

});

router.get('/centros-medicos', isLoggedIn, function(req, res) {
  //res.render('usuario/centros_medicos', { title: 'Centros Medicos' });
  Centro.find(function(err, centros){
    res.render('usuario/centros_medicos', { 
      title: 'SaludPrimero | Centros', 
      centroslist: centros
    });
  });  
});

router.get('/centros-medicos/list', isLoggedIn, function(req, res) {
  //res.render('usuario/centros_medicos', { title: 'Centros Medicos' });
  Centro.find(function(err, centros){
    res.send(centros);
  });  
});



router.use('/', notLoggedIn, function (req, res, next) {
    next();
});

function isLoggedIn(req, res, next) {
    console.log("baia baia: " + req.session.rol);
    if (req.isAuthenticated() && req.session.rol === "cliente"){
        return next();
    }
    console.log('sesion del cliente, no tiene permiso');
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