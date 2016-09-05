var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema;
var deepPopulate = require('mongoose-deep-populate')(mongoose);


var schema = new Schema({
	email: {type: String, required: true}, 
	password: {type: String, required: true}, 
	rol: String,
	paciente: {type: Schema.Types.ObjectId, ref: 'pacientesdb'}
});


schema.methods.encryptPassword = function (password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);
};

schema.methods.validPassword = function (password) {
	return bcrypt.compareSync(password, this.password);
};

schema.plugin(deepPopulate);


module.exports = mongoose.model("userLogin", schema);
