var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: 'userLogin' },
    muestras: [{type: Schema.Types.ObjectId, ref: 'muestradb'}],
    nombres: String,
    apellidos: String,
    direccion: String,
    cedula: String,
    email: String,
    telefonos: [],
    foto: String,
});

module.exports = mongoose.model('pacientesdb', schema);