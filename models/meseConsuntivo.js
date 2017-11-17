const mongoose = require('mongoose');

const MeseConsuntivoSchema = mongoose.Schema({

	id_utente: {
		type: String,
		required: true
	},
	anno_consuntivo: {
		type: Number,
		required: true
	},
	mese_consuntivo: {
		type: Number,
		required: true
	},
	nome_stato:{
		type: String,
		required: true
	}
});

const MeseConsuntivo = module.exports = mongoose.model('MeseConsuntivo', MeseConsuntivoSchema); 
