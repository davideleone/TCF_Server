const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
	_id: {
		type: String,
		required: true
	},
	id_sede:{
		type: String,
		required: false
	},
	password:{
		type: String,
		required: true
	},
	cognome:{
		type: String,
		required: true
	},
	nome:{
		type: String,
		required: true
	},
	email:{
		type: String,
		required: true
	},
	data_inizio_validita:{
		type: Date,
		required: true,
		default: Date.now
	},
	data_fine_validita:{
		type: Date,
		required: false
	},
	clienti: [
		{
			cliente: {
				type: mongoose.Schema.Types.ObjectId, ref: 'Cliente' ,
				required: false
			},
			profilo : {
				type: String,
				required: false
			},
			data_inizio_validita_cliente: {
				type : Date,
				required: false
			},
			data_fine_validita_cliente: {
				type : Date,
				required: false
			}
		}
	],
	isAdmin: {
		type: Boolean,
		required: true,
		default: false
	}

});


const User = module.exports = mongoose.model('User', UserSchema); 