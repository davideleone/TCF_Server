const express = require('express');
const routerCliente = express.Router();
var clienteService = require('../services/cliente.service');

routerCliente.post('/cliente', addCliente);
routerCliente.get('/clienti', getClienti);
routerCliente.get('/clienteById/:idCliente', getClienteById);

function addCliente(req, res){
	clienteService.addCliente(req.body).then(function(){
		 res.sendStatus(200);
	}).catch(function (err) {
		res.status(400).send(err);
	});
	
};

function getClienti(req, res){
	clienteService.getClienti().then(function(clienti){
		 res.send(clienti);
	}).catch(function (err) {
            res.status(400).send(err);
    });
	
};

function getClienteById(req, res){
	clienteService.getClienteById(req.params.idCliente).then(function(clienti){
		 res.send(clienti);
	}).catch(function (err) {
		res.status(400).send(err);
    });
	
};


module.exports = routerCliente;