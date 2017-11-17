const mongoose = require('mongoose');

const ProfiloSchema = mongoose.Schema({
	_id: {
		type: String,
		required: true
	},
	nome_profilo:{
		type: String,
		required: true
	},
	data_inizio_validita:{
		type: Date,
		required: true,
	},
	data_fine_validita:{
		type: Date,
		required: false
	}
});

ProfiloSchema.methods.findAll = function findAll(params, callback) {
	return this.model('Profilo').find( { 
		$or: [ { data_fine_validita: null }, { data_fine_validita: { $gte: Date.now() } } ] }).
		where('data_inizio_validita').lte(Date.now()).
		exec(callback);
}

const Profilo = module.exports = mongoose.model('Profilo', ProfiloSchema); 

