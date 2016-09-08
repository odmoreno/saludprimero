var express = require('express');
var router = express.Router();
var passport = require('passport');

var User = require('../models/user_login');
var Paciente = require('../models/paciente');


var nodemailer= require('nodemailer');
var Centro= require('../models/modCentro');
var Muestra=require('../models/muestra');

// necesita un transporter, aqui esta para enviar desde un gmail
var transporter = nodemailer.createTransport("SMTP",{
    service: "Gmail",
    auth:{
        user: "saludprimerooperario2016@gmail.com",
        pass: "Sp123456"
    }
});


router.get('/logout', isLoggedIn,function (req, res, next) {
    req.logout();
    res.redirect('/user/signin');
});


router.get('/', isLoggedIn, function(req, res, next) {
    console.log(req.isAuthenticated() +  ' :valor');
    res.render('operario/homeOpe', { title: 'Bienvenido' });

});

router.get('/pacientes', isLoggedIn, function(req, res, next) {
    Paciente.find().exec(function(err, paciente){
        res.render('operario/admin_pacientes', { title: 'Administrar Pacientes',
            pacientes: paciente});
    })

});

router.post('/pacientes/eliminar',isLoggedIn, function(req, res, next){
    console.log(req.body.cedulas);
    Paciente.findOne({cedula:req.body.cedulas})
        .populate('user')
        .exec(function (err, paciente) {
            if (err) return handleError(err);
            console.log("-------------FASE DE ELIMINACION-----------");
            console.log(paciente);
            console.log(paciente.user);
            User.findOneAndRemove({_id : paciente.user._id} , function (err, response) {
                console.log(response);
                console.log("removido user");
            });
            Paciente.findOneAndRemove({_id : paciente._id}, function (err, response) {
                console.log(response);
                console.log("removido paciente");
            });

        });
    res.redirect("operario/pacientes");
    /*Paciente.remove({cedula:req.body.cedulas}).exec(function (err){
            if (err) return handleError(err);
        });*/
});

router.get('/ingreso-muestras', isLoggedIn, function(req, res, next) {
    var messages = req.flash('error');
    Paciente.find().exec(function(err, paciente){
        res.render('operario/ingreso_muestra', { title: 'Ingreso Muestras',
            pacientes: paciente});
    });
   // res.render('operario/ingreso_muestra', { title: 'Ingreso de Muestras', messages: messages, hasErrors: messages.length > 0});
    //res.render('operario/ingresomuestra');
});

router.get('/muestras', isLoggedIn,function(req, res, next) {
    Muestra.find({estado: "Pendiente"}).populate('paciente').exec(function(err, muestras){
        //console.log(muestras);
        res.render('operario/admin_muestra', { title: 'Administrar Muestras',
            muestras: muestras
        });
    });

});

router.get('/ingreso-muestras/centroslist',isLoggedIn, function(req,res,next){
    Centro.find(function(err, centros){
        res.send(centros);
    });
});

router.get('/muestras/editar', isLoggedIn, function(req, res, next) {
    console.log("Editar Muestra");
    console.log( "query:" + req.query.codigo);
    Muestra.findOne({codigo: req.query.codigo})
        .populate({path: 'paciente'})
        .exec(function(err, muestra){
            if (err) return handleError(err);
            res.render('operario/editar_muestra', {
                title: 'Administrar Pacientes',
                muestra: muestra
            });
    });

});

router.post('/muestras/editar_muestra', isLoggedIn, function(req, res, next){
    console.log("post editar muestra");
    var paciente = req.body.cedula;
    console.log(paciente);
    var fecha = req.body.fecha;
    console.log(fecha);
    var centro = req.body.centro;
    console.log(centro);
    var muestra1 = req.body.muestra;
    console.log(muestra1);
    var lab = req.body.lab;
    console.log(lab);
    var examen = req.body.examen;
    console.log(examen);
    var num = fecha.replace(/-/g, "a");
    var codigo = req.body.codigo;
    console.log(codigo);
    var muestraAnt = req.body.tipoAnt;
    console.log(muestraAnt);
    Muestra.findOne({codigo: codigo})
        .populate({path: 'paciente'})
        .exec(function(err, muestra){
            if (err) return handleError(err);
            console.log(muestra);
            if (muestra1 == muestraAnt){
                console.log("-----------muestras coincidentes------------");
                muestra.fecha = fecha;
                muestra.centro = centro;
                muestra.lab = lab;
                muestra.examenes.push({
                    nombre: examen,
                    resultados: []
                });
                muestra.save(function (err) {
                    if (err) return handleError(err);
                    console.log("Muestra EDITADA");
                })
            }
            else {
                muestra.fecha = fecha;
                muestra.centro = centro;
                muestra.lab = lab;
                muestra.tipo = muestra1;
                muestra.examenes = [];
                exa = {
                    nombre: examen,
                    resultados: []
                };
                muestra.examenes.push(exa);
                muestra.save(function (err) {
                    if (err) return handleError(err);
                    console.log("Muestra EDITADA");
                })
            }

        });
    res.redirect('/operario/muestras');
});

router.get('/muestras/editar/centroslist', isLoggedIn, function(req,res,next){
    Centro.find(function(err, centros){
        res.send(centros);
    });
});


router.post('/muestras/eliminar', isLoggedIn, function(req, res, next){
    console.log(req.body.codigo);
    Muestra.remove({codigo:req.body.codigo}).exec(function (err){
            if (err) return handleError(err);
    })
});

router.get('/reportes', isLoggedIn, function(req, res, next) {
    Muestra.find().exec(function(err, muestras){
        res.render('operario/generar_reportes', { title: 'Generacion de Reportes',
        muestras: muestras});
        console.log(muestras);
    })
});

router.get('/reportes/estadistica', isLoggedIn, function(req, res, next){
    res.render('operario/graficos_res', {title: 'Resultados Estadisticos'});
});

router.post('/ingreso-muestras/nuevaMuestra', isLoggedIn, function (req, res) {

    console.log("POST Ingreso muestra");
    var lab = req.body.lab;
    console.log(lab);
    var centro = req.body.centro;
    console.log(centro);
    var muestra = req.body.muestra;
    console.log(muestra);
    var fecha = req.body.fecha;
    console.log(fecha);
    var cedula = req.body.cedula;
    console.log(cedula);
    var examen1 = req.body.examenes;
    var num = fecha.replace(/-/g, "a");
    ////var examen2 = req.body.examen2;
    //var examen3 = req.body.examen3;
    //console.log(examen1 + ":examen1");
    //console.log(examen2 + ":examen2");
    //console.log(examen3 + ":examen3");

    if(muestra === "Sangre"){
        Paciente.findOne({cedula: cedula})
            .populate('muestras')
            .exec(function (err, paciente) {
                
                var muestra1 = new Muestra({
                    tipo : muestra,
                    fecha : fecha,
                    codigo : cedula + num,
                    estado : "Pendiente",
                    centro : centro,
                    lab : lab,
                    examenes:[{
                        nombre: examen1,
                        resultados: []
                    }]
                });
                muestra1.paciente = paciente._id;
                muestra1.save(function (err) {
                    if (err) return handleError(err);
                    console.log("wardiola");
                    paciente.muestras.push(muestra1);
                    paciente.save(function (err) {
                        if (err) return handleError(err);
                        console.log("funciona!");
                    });
                });


            });
    }else {
        Paciente.findOne({cedula: cedula})
            .populate('muestras')
            .exec(function (err, paciente) {
                var muestra1 = new Muestra({
                    tipo : muestra,
                    fecha : fecha,
                    codigo : cedula + num,
                    estado : "Pendiente",
                    centro : centro,
                    lab : lab,
                    examenes:[{
                        nombre: examen1,
                        resultados: []
                    }]
                });
                muestra1.paciente = paciente._id;
                muestra1.save(function (err) {
                    if (err) return handleError(err);
                    console.log("wardiola");
                    paciente.muestras.push(muestra1);
                    paciente.save(function (err) {
                        if (err) return handleError(err);
                        console.log("funciona!");
                    });
                });
            });
    }


    res.redirect('/operario/muestras');

});
router.post('/ingreso-muestras/nuevoPaciente', isLoggedIn, function (req, res, done) {
        console.log("POST:" + req.param('email'));
        var email = req.param('email');
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
                console.log("Error");
                return done(err);
                //return handleError(err);
            }
            if(user){
                console.log("Email en uso, use otro");
                return done(null, false, {message: 'Email is already in use'});
                //return res.redirect('/operario/ingreso-muestras');
            }
            var newUser = new User();
            newUser.email = email;
            var pass = "";
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            for( var i=0; i < 8; i++ ) {
                pass += possible.charAt(Math.floor(Math.random() * possible.length));
            }

            newUser.password= newUser.encryptPassword(pass);
            newUser.rol = "cliente";
            newUser.save(function (err, result) {
                if(err){
                    return done(err);
                }
                //return done(null, newUser);
                console.log("Estamos en pacientes");
                var paciente = new Paciente();
                paciente.user = newUser._id;
                paciente.nombres = req.param('nombre');
                paciente.apellidos = req.param('apellido');
                paciente.direccion= "";
                paciente.telefono= "";
                paciente.email= email;
                paciente.cedula = req.param('cedula');
                paciente.email = email;
                paciente.muestras = [];
                paciente.save(function (err) {
                    if (err) return handleError(err);
                    newUser.paciente = paciente._id;
                    newUser.save();
                    console.log("funciona!");
                });


            });
            var mailOptions = {
                from: '"Salud Primero S.A" <saludprimerooperario2016@gmail.com>', // sender address
                to: email, // list of receivers
                subject: 'Creacion de Cuenta', // Subject line
                text: 'Se ha creado exitosamente su cuenta en el sistema de Salud Primero S.A\n' +
                'Su Contraseña temporal sera :'+ pass+'' +
                '\nPor favor acceder al sistema y cambiar su contraseña', // plaintext body
            };
            transporter.sendMail(mailOptions, function(error, info) {
                if (error) {
                    // poner que paso un error
                    return console.log("NO ENVIO");

                }
                //poner que fue exitoso
                console.log('Message sent: ' + info.response);
            });
        });
        res.redirect('/operario/pacientes');

    }
);

router.use('/', notLoggedIn, function (req, res, next) {
    next();
});

/*
router.use('/', notLoggedIn, function (req, res, next) {
    next();
});
*/
function isLoggedIn(req, res, next) {
    console.log(req.session.rol);
    if (req.isAuthenticated() && req.session.rol === "operario"){
        return next();
    }
    console.log('sesion del operario, no tiene permiso');
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