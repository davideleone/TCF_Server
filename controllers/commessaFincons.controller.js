const express = require('express');
const routerCommessaFincons = express.Router();

var commessaFinconsService = require('services/commessaFincons.service');

routerCommessaFincons.post('/addOrUpdateCommessaFincons', insOrUpdCommessaFincons);


function insOrUpdCommessaFincons(req, res){
	commessaFinconsService.addOrUpdateCommessaFincons(req.body).then(function(commessa){
		res.send(commessa);
	}).catch(function (err) {
       	res.status(400).send(err);
    });	
};



module.exports = routerCommessaFincons;
