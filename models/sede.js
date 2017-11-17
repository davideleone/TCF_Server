const mongoose = require('mongoose');



const SedeSchema = mongoose.Schema({

	_id: {
		type: String,
		required: true
	},
	nome_sede:{
		type: String,
		required: true
	},
	data_inizio_validita:{
		type: Date,
		required: false,
	},
	data_fine_validita:{
		type: Date,
		required: false
	}
});


SedeSchema.methods.findAll = function findAll(params, callback) {
	return this.model('Sede').find( { 
		$or: [ { data_fine_validita: null }, { data_fine_validita: { $gte: Date.now() } } ] }).
		where('data_inizio_validita').lte(Date.now()).
		exec(callback);
}

const Sede = module.exports = mongoose.model('Sede', SedeSchema); 

