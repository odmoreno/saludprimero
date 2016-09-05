var Centro = require('../models/modCentro');

var mongoose = require('mongoose');
//mongodb://admin:SaludPrimero@ds153835.mlab.com:53835/saludprimero30
//mongodb://admin:oscarpol@ds161295.mlab.com:61295/practicanode
mongoose.connect('mongodb://admin:SaludPrimero@ds153835.mlab.com:53835/saludprimero30');
require('../config/passport');


var  centros = [
    new Centro ({
		nombre: "SaludPrimero Centro", 
		horarios: "8:00 a 20:00", 
		direccion: "Av. 9 de Octubre",
		descripcion: "Centro medico localizado en el centro de la ciudad.",
		latitud: "-30",
		longitud: "-79",
		imagenesURL: ["http://www.elciudadano.gob.ec/wp-content/uploads/2015/07/hosp-abel-gilbert.jpg", "http://www.andes.info.ec/sites/default/files/styles/large/public/9684335869_3441161f78_k.jpg?itok=AayXmXRK"]

    }),
    new Centro ({
		nombre: "SaludPrimero Urdesa", 
		horarios: "7:30 a 21:00", 
		direccion: "direccion 2",
		descripcion: "Centro medico localizado en Urdesa.",
		latitud: "-30",
		longitud: "-79",
		imagenesURL: ["http://www.andes.info.ec/sites/default/files/styles/large/public/field/image/hospital_3.jpg?itok=Gpq9Om0h", "http://www.andes.info.ec/sites/default/files/styles/large/public/field/image/hospital%20santo%20domingo%20iess.jpg?itok=ZnH9_tdC"]
    })
];

var done = 0;
for (var i=0; i< centros.length; i++){
    centros[i].save(function(err,result){
        done++;
        if(done === centros.length){
            exit();
        }
    });
}
function exit(){
    mongoose.disconnect();
}
