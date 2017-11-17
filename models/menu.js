const mongoose = require('mongoose');

const MenuSchema = mongoose.Schema({

	title_menu: {
		type: String,
		required: true
	},
	desc_menu: {
		type: String,
		required: false
	},
	url: {
		type: String,
		required: true,
		default: "#"
	},
	profile: {
		type: String,
		required: true
	},
	children_menu: {
		type: [mongoose.Schema.Types.MenuEntry],
		required: false
	},
	ord_vis: {
		type: Number,
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
});

const MenuEntry = module.exports = mongoose.model('Menu', MenuSchema); 