var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var deepPopulate = require('mongoose-deep-populate')(mongoose);

var schema = new Schema({
    tipo: {type: String, required: true},
    fecha: {type: String, required: true},
    paciente: {type: Schema.Types.ObjectId, ref: 'pacientesdb' },
    codigo: String,
    estado: String,
    centro: String,
    lab: String,
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

schema.plugin(deepPopulate);
module.exports = mongoose.model("muestradb", schema);



