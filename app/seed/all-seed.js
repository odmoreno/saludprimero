var User = require('../models/user_login');
var Paciente = require('../models/paciente');
var Muestra = require('../models/muestra');

var mongoose = require('mongoose');
//mongodb://admin:SaludPrimero@ds153835.mlab.com:53835/saludprimero30
//mongodb://admin:oscarpol@ds161295.mlab.com:61295/practicanode
mongoose.connect('mongodb://admin:SaludPrimero@ds153835.mlab.com:53835/saludprimero30');
require('../config/passport');


var muestra1 = new Muestra({
    tipo: "Sangre",
    fecha: Date.now(),
    codigo: "123456",
    estado: "Listo",
    examenes: [{
        nombre: "Hemograma",
        resultados: [{
            parametro: "hematocrito",
            unidades: "mg/dl",
            medidas: "44.9",
            referencia: "35.2 - 52.8"
        }, {
            parametro: "Linfocitos",
            unidades: "mg/dl",
            medidas: "22",
            referencia: "9 - 26"
        }]
    }]
});



var muestra2 = new Muestra({
    tipo: "Orina",
    fecha: Date.now(),
    codigo: "123457",
    estado: "Pendiente",
    examenes: [{
        nombre: "examen de orina",
        resultados: [{
            parametro: "cosas de orina 1",
            unidades: "mg/dl",
            medidas: "44.9",
            referencia: "35.2 - 52.8"
        }, {
            parametro: "cosas de orina 2",
            unidades: "mg/dl",
            medidas: "22",
            referencia: "9 - 26"
        }]
    }]
});

var muestra3 = new Muestra({
    tipo: "Heces",
    fecha: Date.now(),
    codigo: "123458",
    estado: "Pendiente",
    examenes: []
});

var muestra4 = new Muestra({
    tipo: "Sangre",
    fecha: Date.now(),
    codigo: "123459",
    estado: "Pendiente",
    examenes: []
});

var muestra5 = new Muestra({
    tipo: "Orina",
    fecha: Date.now(),
    codigo: "1234560",
    estado: "Pendiente",
    examenes: []
});

var user1 = new User ({
    email: 'oscarmoreno_ds@hotmail.com',
    password: '1234',
    rol: 'cliente'
});
user1.password = user1.encryptPassword(user1.password);

var user2 = new User ({
    email: 'veronica@hotmail.com',
    password: '1234',
    rol: 'operario'
});

user2.password = user2.encryptPassword(user2.password);
//user2.save();

var user3 = new User ({
    email: 'edgar@hotmail.com',
    password: '1234',
    rol: 'laboratorista'
});
user3.password = user3.encryptPassword(user3.password);
//user3.save();

var user4 = new User ({
    email: 'carlos@hotmail.com',
    password: '1234',
    rol: 'cliente'
});
user4.password = user4.encryptPassword(user4.password);
//user4.save();


var paciente1 = new Paciente ({
    user: user1._id,
    nombres: "oscar",
    apellidos: "moreno",
    direccion: "av. brasil",
    cedula: "0931245226",
    email: "oscar@hotmail.com",
    telefonos: ["123489", "1312312"],
    foto: "foto"
});
paciente1.muestras.push(muestra1);
//paciente1.muestras.push(muestra2);

var paciente2 = new Paciente ({
    user: user4._id,
    nombres: "Carlos",
    apellidos: "Manosalvals",
    direccion: "av. debo hacer más u.u",
    cedula: "093222323",
    email: "carlos@hotmail.com",
    telefonos: ["123489", "1312312"],
    foto: "foto"
});

//paciente2.muestras.push(muestra1);
paciente2.muestras.push(muestra2);

muestra1.paciente = paciente1._id;
muestra2.paciente = paciente2._id;
muestra3.paciente = paciente2._id;
muestra4.paciente = paciente2._id;
muestra5.paciente = paciente2._id;

muestra1.save();
muestra2.save();
muestra3.save();
muestra4.save();
muestra5.save();

paciente1.save();
paciente2.save();

user1.paciente = paciente1._id;
user4.paciente = paciente2._id;
user1.save();
user2.save();
user3.save();
user4.save();

//mongoose.disconnect();