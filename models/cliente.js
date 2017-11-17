const mongoose = require('mongoose');

const ClienteSchema = mongoose.Schema({
	nome_cliente: {
		type: String,
		required: true
	},
	data_inizio_validita: {
		type: Date,
		required: true,
	},
	data_fine_validita: {
		type: Date,
		required: false
	},
	ambiti: [
		{
			id_ambito: {
				type: String,
				required: true
			},
			data_inizio_validita: {
				type: Date,
				required: false,
			},
			data_fine_validita: {
				type: Date,
				required: false
			}
		}]
});


ClienteSchema.methods.findAll = function findAll(params, callback) {
	return this.model('Cliente').find({
		$or: [{ data_fine_validita: null }, { data_fine_validita: { $gte: Date.now() } }]
	}).
		where('data_inizio_validita').lte(Date.now()).
		exec(callback);
}

const Cliente = module.exports = mongoose.model('Cliente', ClienteSchema); 
