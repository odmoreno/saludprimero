var mongoose = require('mongoose');

var UsuarioSchema = new mongoose.Schema({
	nombres: String, 
	apellidos: String, 
	cedula: String,
	email: String,
	dir: String,
	telf: String,
	img: String
});

module.exports = mongoose.model("modUsuario", UsuarioSchema);