const mongoose = require('mongoose');

const MacroAreaSchema = mongoose.Schema({
	_id: {
		type: String,
		required: true
	},
	nome_macro_area:{
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

MacroAreaSchema.methods.findAll = function findAll(params, callback) {
	return this.model('MacroArea').find( { 
		$or: [ { data_fine_validita: null }, { data_fine_validita: { $gte: Date.now() } } ] }).
		where('data_inizio_validita').lte(Date.now()).
		exec(callback);
}

const MacroArea = module.exports = mongoose.model('MacroArea', MacroAreaSchema); 