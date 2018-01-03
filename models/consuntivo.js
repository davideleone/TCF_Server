const mongoose = require('mongoose');

const ConsuntivoSchema = mongoose.Schema({

	data_consuntivo: {
		type: Date,
		required: true
	},
	id_utente: {
		type: mongoose.Schema.Types.ObjectId, ref: 'User',
		required: true
	},
	id_cliente: {
		type: mongoose.Schema.Types.ObjectId, ref: 'Cliente',
		required: true
	},
	nome_cliente: {
		type: String,
		required: true
	},
	id_ambito: {
		type: String,
		required: true
	},
	nome_ambito: {
		type: String,
		required: false
	},
	id_macro_area: {
		type: String,
		required: true
	},
	nome_macro_area: {
		type: String,
		required: false
	},
	id_attivita: {
		type: mongoose.Schema.Types.ObjectId, ref: 'Attivita',
		required: true
	},
	nome_attivita: {
		type: String,
		required: false
	},
	id_tipo_deliverable: {
		type: String,
		required: true
	},
	nome_tipo_deliverable: {
		type: String,
		required: false
	},
	note: {
		type: String,
		required: false
	},
	ore: {
		type: Number,
		required: true
	}
});

ConsuntivoSchema.methods.findByClienteAndData = function findByClienteAndData(params, callback) {
	return this.model('Consuntivo').find().
		where('data_consuntivo').equals(params.data).
		where('id_cliente').equals(params.idCliente).
		exec(callback);
}

ConsuntivoSchema.methods.findBetweenDates = function findBetweenDates(params, callback) {
	return this.model('Consuntivo').find().
		where('data_consuntivo').gte(params.start).
		where('data_consuntivo').lte(params.end).
		exec(callback);
}

const Consuntivo = module.exports = mongoose.model('Consuntivo', ConsuntivoSchema); 
