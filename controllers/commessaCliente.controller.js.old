const express = require('express');
const routerCommessaCliente = express.Router();
var commessaClienteService = require('../services/commessaCliente.service');

routerCommessaCliente.get('/commesseClienti/:idCliente', getCommessaByCliente);

function getCommessaByCliente(req, res){
	commessaClienteService.getCommessaByCliente(req.params.idCliente).then(function(commesse){
		 res.send(commesse);
	}).catch(function (err) {
		res.status(400).send(err);
    });
};