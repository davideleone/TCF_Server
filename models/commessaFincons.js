const mongoose = require('mongoose');

const CommessaFinconsSchema = mongoose.Schema({

	codice_commessa:{
		type: String,
		required: true
	},
	nome_commessa:{
		type: String,
		required: true
	},
	budget_euro: {
		type: Number,
		required: false
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

CommessaFinconsSchema.methods.findAll = function findAll(params, callback) {
	return this.model('CommessaFincons').find( { 
		$or: [ { data_fine_validita: null }, { data_fine_validita: { $gte: Date.now() } } ] }).
		where('data_inizio_validita').lte(Date.now()).
		exec(callback);
}

const CommessaFincons = module.exports = mongoose.model('CommessaFincons', CommessaFinconsSchema);
