var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    tipo: {type: String, required: true},
    fecha: {type: String, required: true},
    paciente: {type: Schema.Types.ObjectId, ref: 'pacientesdb' },
    codigo: String,
    estado: String,
    examenes : [{
        nombre: String,
        resultados: [{
            parametro: String,
            unidades: String,
            medidas: String,
            referencia: String
        }]
    }]
});

module.exports = mongoose.model("muestradb", schema);



