const express = require('express');
const routerCommessaCliente = express.Router();

var commessaClienteService = require('services/commessaCliente.service');

routerCommessaCliente.post('/addOrUpdateCommessaCliente', insOrUpdCommessaCliente);


function insOrUpdCommessaCliente(req, res){
	commessaClienteService.addOrUpdateCommessaCliente(req.body).then(function(commessa){
		console.log("SONO NEL CONTROLLER")
		res.send(commessa);
	}).catch(function (err) {
       	res.status(400).send(err);
    });	
};



module.exports = routerCommessaCliente;
