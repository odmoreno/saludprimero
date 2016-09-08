var express = require('express');
var router = express.Router();
var passport = require('passport');
var Centro = require('../models/modCentro');
var Examen = require('../models/modExamen.js');
var UserInfo = require('../models/modUsuario.js');
var usuarioLog = require('../models/user_login');
var Muestra=require('../models/muestra');
var PdfPrinter = require('pdfmake/src/printer');
var fs = require('fs');
var paciente = require('../models/paciente');

router.get('/logout', isLoggedIn, function (req, res, next) {
    req.logout();
    res.redirect('/user/signin');
});



//vistas usuario
router.get('/', isLoggedIn, function(req, res, next) {
    usuarioLog.findOne({ email : req.session['email']})
        .populate('paciente')
        .exec(function (err, user) {
            if (err) return handleError(err);
            res.render('usuario/home',{
                title: 'Bienvenido',
                paciente : user.paciente,
                usuario : user
            });
        });
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

router.post('/perfil/editUser', isLoggedIn, function(req, res, next) {
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

router.get('/password', isLoggedIn, function(req, res, next) {

    usuarioLog.findOne({ email : req.session['email']})
        .populate('paciente')
        .exec(function (err, user) {
            if (err) return handleError(err);
            res.render('usuario/password',{
                title: 'Cambiar Contraseña'
            });
        });
});

router.post('/password/newPass', isLoggedIn, function(req, res, next){
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
     
    res.redirect('/usuario/password');
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

router.post('/examenes/pdf', isLoggedIn, function(req, res, next) {
    console.log("POST PDF");
    var codigo = req.body.codigo;
    console.log(codigo);
    Muestra.findOne({codigo: codigo}).populate('paciente').exec(function(err, muestra){
        var nombre = muestra.paciente.nombres;
        console.log(nombre);
        var apellidos = muestra.paciente.apellidos;
        console.log(apellidos);
        var cedula = muestra.paciente.cedula;
        console.log(cedula);
        var email = muestra.paciente.email;
        console.log(email);
        var nombreExamen = muestra.examenes[0].nombre;
        console.log(nombreExamen);

        var fonts = {
            Roboto: {
                normal: 'public/fonts/Roboto-Regular.ttf',
                bold: 'public/fonts/Roboto-Medium.ttf',
                italics: 'public/fonts/Roboto-Italic.ttf',
                bolditalics: 'public/fonts/Roboto-Italic.ttf'
            }
        };
        var printer = new PdfPrinter(fonts);
        


        var dd = {
            content: [
                { text: 'SaludPrimero S.A. - Mis Exámenes', style: 'header' },
                { text: 'Información General', style: 'subheader' },
                {
                    style: 'tableExample',
                    table: {
                        widths: [100, '*', 100, '*'],
                        body: [
                            [ { text: 'Nombre: ', bold: true }, nombre, { text: 'Apellidos: ', bold: true }, apellidos],
                            [ { text: 'Cédula: ', bold: true }, cedula, { text: 'Email: ', bold: true }, email]
                        ]
                    },
                    layout: 'noBorders'
                },
                { text: 'Resultados de los Exámenes', style: 'header' },
                { text: nombreExamen, style: 'subheader' },
                {
                    style: 'tableExample',
                    table: {
                        widths: [100, '*', 100, '*'],
                        body: [
                            [{ text: 'Parámetro', style: 'tableHeader', alignment: 'center' },{ text: 'Resultado', style: 'tableHeader', alignment: 'center' }, { text: 'Unidad', style: 'tableHeader', alignment: 'center' }, { text: 'Valor de Referencia', style: 'tableHeader', alignment: 'center' }],
                        ]
                    },
                    layout: 'lightHorizontalLines'
                }
            ],
            styles: {
                header: {
                fontSize: 18,
                bold: true,
                margin: [0, 0, 0, 10]
                },
                subheader: {
                fontSize: 16,
                bold: true,
                margin: [0, 10, 0, 5]
                },
                tableExample: {
                margin: [0, 5, 0, 15]
                },
                tableHeader: {
                bold: true,
                fontSize: 13,
                color: 'black'
                }
            },
            defaultStyle: {
            // alignment: 'justify'
            }
        }
        muestra.examenes[0].resultados.forEach(function(resultado){
            dd.content[5].table.body.push([resultado.parametro, resultado.medidas, resultado.unidades, resultado.referencia]);
        });

        var pdfDoc = printer.createPdfKitDocument(dd);
        pdfDoc.pipe(fs.createWriteStream('pdfs/'+codigo+".pdf"));
        pdfDoc.end();
        res.redirect('/usuario/examenes');
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