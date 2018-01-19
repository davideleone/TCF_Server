const express = require('express');
const routerCommessaCliente = express.Router();

var commessaClienteService = require('services/commessaCliente.service');

routerCommessaCliente.post('/meseConsuntivoCliente', insOrUpdCommessaCliente);


function insOrUpdCommessaCliente(req, res){
	commessaClienteService.insOrUpdMeseConsuntivoUtente(req.body).then(function(){
		res.sendStatus(200);
	}).catch(function (err) {
        res.status(400).send(err);
    });	
};



module.exports = routerCommessaCliente;
