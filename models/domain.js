const mongoose = require('mongoose');

const DomainSchema = mongoose.Schema({
	
	system: {
		type: String,
		required: true
	},
	subsystem:{
		type: String,
		required: true
	},
	funct:{
		type: String,
		required: true
	},
	key:{
		type: String,
		required: true
	},
	value:{
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


const Domain = module.exports = mongoose.model('Domain', DomainSchema); 