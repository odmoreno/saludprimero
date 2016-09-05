var mongoose = require('mongoose');

var CentroSchema = new mongoose.Schema({
	nombre: String, 
	horarios: String, 
	direccion: String,
	descripcion: String,
	latitud: String,
	longitud: String,
	imagenesURL: [String] 
});

module.exports = mongoose.model("Centro", CentroSchema);