const mongoose = require('mongoose');

const AttivitaSchema = mongoose.Schema({

	id_ambito: {
		type: String,
		required: true
	},
	nome_ambito: {
		type: String,
		required: true
	},
	id_commessa_cliente: {
		type: String,
		required: true
	},
	nome_commessa_cliente: {
		type: String,
		required: true
	},
	id_cliente: {
		type: String,
		required: true
	},
	nome_cliente: {
		type: String,
		required: true
	},
	id_macro_area: {
		type: String,
		required: true
	},
	nome_macro_area: {
		type: String,
		required: true
	},
	nome_attivita: {
		type: String,
		required: true
	},
	codice_attivita: {
		type: String,
		required: true
	},
	descrizione: {
		type: String,
		required: false
	},
	budget_euro: {
		type: Number,
		required: false
	},
	budget_ore: {
		type: Number,
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
	stato_attivita: {
		type: String,
		required: true
	},
	nome_stato: {
		type: String,
		required: true
	}
});

AttivitaSchema.methods.findAll = function findAll(params, callback) {
	return this.model('Attivita').find({
		$or: [{ data_fine_validita: null }, { data_fine_validita: { $gte: Date.now() } }]
	}).
		where('data_inizio_validita').lte(Date.now()).
		exec(callback);
}

AttivitaSchema.methods.findByCommessaClienteAndAmbito = function findByCommessaClienteAndAmbito(params, callback) {
	return this.model('Attivita').find({
		$or: [{ data_fine_validita: null }, { data_fine_validita: { $gte: Date.now() } }]
	}).
		where('data_inizio_validita').lte(Date.now()).
		where('id_commessa_cliente').equals(params.idCommessaCliente).
		where('id_ambito').equals(params.idAmbito).
		exec(callback);
}

const Attivita = module.exports = mongoose.model('Attivita', AttivitaSchema); 