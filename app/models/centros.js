var mongoose = require('mongoose');

var centrosSchema = new mongoose.Schema({
    nombre: {type: String, required: true},
    direccion: String,
    Descripcion: String,
    imagen: String,
    labs:[{
        nombre: {type: String, required: true},
        horarios: []
    }]
});

module.exports = mongoose.model("centros", centrosSchema);
