var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    nombre: {type: String, required: true},
    resultado: [{
        parametro: String,
        unidades: String,
        medidas: String,
        referencia: String
    }]
});

module.exports = mongoose.model('examendb', schema);

