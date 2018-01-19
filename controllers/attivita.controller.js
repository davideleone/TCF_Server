const express = require('express');
const routerAttivita = express.Router();
var attivitaService = require('../services/attivita.service');

routerAttivita.post('/attivita', addAttivita);
routerAttivita.get('/attivitaById/:idAttivita', getAttivitaById);
routerAttivita.get('/attivitaAll', getAttivitaAll);

function addAttivita(req, res){
	attivitaService.addAttivita(req.body).then(function(attivita){
		res.send(attivita);
	}).catch(function (err) {
		res.status(400).send(err);
	});
	
};

function getAttivitaById(req, res){
	attivitaService.getAttivitaById(req.params.idAttivita).then(function(attivita){
		 res.send(attivita);
	}).catch(function (err) {
		res.status(400).send(err);
    });
	
};

function getAttivitaAll(req, res){
	attivitaService.getAttivitaAll(req).then(function(attivita){
		 res.send(attivita);
	}).catch(function (err) {
		res.status(400).send(err);
    });
	
};


module.exports = routerAttivita;