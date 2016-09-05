var mongoose = require('mongoose');

var ExamenSchema = new mongoose.Schema({
	fechaMuestra: Date, 
	tipoMuestra: String,
	estado: String
});

module.exports = mongoose.model("Examen", ExamenSchema);