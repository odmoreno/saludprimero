var User = require('../models/modUsuario');

var mongoose = require('mongoose');
//mongodb://admin:SaludPrimero@ds153835.mlab.com:53835/saludprimero30
//mongodb://admin:oscarpol@ds161295.mlab.com:61295/practicanode
mongoose.connect('mongodb://admin:SaludPrimero@ds153835.mlab.com:53835/saludprimero30');


var  userInfo = [
    new User ({
		nombres: "Edgar Daniel", 
		apellidos: "Moreira Apolo", 
		cedula: "1721989356",
		email: "edgar@hotmail.com",
		dir: "calle a",
		telf: "0993100552",
		img: ""
    }),
    new User ({
        nombres: "Carlos", 
        apellidos: "Manosalvas", 
        cedula: "0913546525",
        email: "carlos@hotmail.com",
        dir: "calle b",
        telf: "0992544669",
        img: ""
    })
];

var done = 0;
for (var i=0; i< userInfo.length; i++){
   userInfo[i].save(function(err,result){
        done++;
        if(done === userInfo.length){
            exit();
        }
    });
}
function exit(){
    mongoose.disconnect();
}
