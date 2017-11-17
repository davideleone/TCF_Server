const express = require('express');
const routerDomain = express.Router();
var domainService = require('services/domain.service');


routerDomain.post('/profilo', addProfilo);
routerDomain.get('/profili', getProfili);
routerDomain.post('/commessa', addCommessa);
routerDomain.get('/commesse', getCommesse);
routerDomain.get('/commesse/:idCliente', getCommesseCliente);
routerDomain.post('/macroArea', addMacroArea);
routerDomain.get('/macroAree', getMacroAree);
routerDomain.post('/commessaFincons', addCommessaFincons);
routerDomain.get('/commesseFincons', getCommesseFincons);
routerDomain.post('/ambito', addAmbito);
routerDomain.get('/ambiti', getAmbiti);
routerDomain.get('/ambiti/:idCliente', getAmbitiCliente);
routerDomain.post('/addAttivita', addAttivita);
routerDomain.get('/attivita', getAttivita);
routerDomain.get('/attivita/:idCommessaCliente/:idAmbito', getAttivitaByCommessaClienteAndAmbito);
routerDomain.post('/addStatoAttivita', addStatoAttivita);
routerDomain.get('/statiAttivita', getStatiAttivita);
routerDomain.post('/addTipoDeliverable', addTipoDeliverable);
routerDomain.get('/tipiDeliverable', getTipiDeliverable);
routerDomain.post('/addStatoMeseConsuntivo', addStatoMeseConsuntivo);
routerDomain.get('/statiMeseConsuntivo', getStatiMeseConsuntivo);

function addProfilo(req, res){
	domainService.addProfilo(req.body).then(function(){
		 res.sendStatus(200);
	}).catch(function (err) {
            res.status(400).send(err);
        });
	
};

function getProfili(req, res){
	domainService.getProfili().then(function(profili){
		 res.send(profili);
	}).catch(function (err) {
            res.status(400).send(err);
	});
	
};


function addCommessa(req, res){
	domainService.addCommessa(req.body).then(function(){
		 res.sendStatus(200);
	}).catch(function (err) {
            res.status(400).send(err);
        });
	
};

function getCommesse(req, res){
	domainService.getCommesse().then(function(commesse){
		 res.send(commesse);
	}).catch(function (err) {
            res.status(400).send(err);
	});
	
};

function getCommesseCliente(req, res){
	domainService.getCommesseCliente(req.params.idCliente).then(function(commesseCliente){
		 res.send(commesseCliente);
	}).catch(function (err) {
            res.status(400).send(err);
	});
	
};


function addMacroArea(req, res){
	domainService.addMacroArea(req.body).then(function(){
		 res.sendStatus(200);
	}).catch(function (err) {
            res.status(400).send(err);
        });
	
};

function getMacroAree(req, res){
	domainService.getMacroAree().then(function(macroaree){
		 res.send(macroaree);
	}).catch(function (err) {
            res.status(400).send(err);
	});
	
};

function addCommessaFincons(req, res){
	domainService.addCommessa(req.body).then(function(){
		 res.sendStatus(200);
	}).catch(function (err) {
            res.status(400).send(err);
        });
	
};

function getCommesseFincons(req, res){
	domainService.getCommesseFincons().then(function(commesseFincons){
		 res.send(commesseFincons);
	}).catch(function (err) {
            res.status(400).send(err);
	});
	
};


function addAmbito(req, res){
	domainService.addAmbito(req.body).then(function(){
		 res.sendStatus(200);
	}).catch(function (err) {
            res.status(400).send(err);
        });
	
};

function getAmbiti(req, res){
	domainService.getAmbiti().then(function(ambiti){
		 res.send(ambiti);
	}).catch(function (err) {
            res.status(400).send(err);
	});
	
};

function getAmbitiCliente(req, res){
	domainService.getAmbitiCliente(req.params.idCliente).then(function(ambiti){
		 res.send(ambiti);
	}).catch(function (err) {
            res.status(400).send(err);
	});
	
};


function addAttivita(req, res){
	domainService.addAttivita/1(req.body).then(function(){
		 res.sendStatus(200);
	}).catch(function (err) {
            res.status(400).send(err);
        });
	
};

function getAttivita(req, res){
	domainService.getAttivita().then(function(attivita){
		 res.send(attivita);
	}).catch(function (err) {
            res.status(400).send(err);
	});
	
};

function getAttivitaByCommessaClienteAndAmbito(req, res){
	domainService.getAttivitaByCommessaClienteAndAmbito(req.params.idCommessaCliente, req.params.idAmbito).then(function(attivita){
		 res.send(attivita);
	}).catch(function (err) {
            res.status(400).send(err);
	});
	
};


function addStatoAttivita(req, res){
	domainService.addStatoAttivita(req.body).then(function(){
		 res.sendStatus(200);
	}).catch(function (err) {
            res.status(400).send(err);
        });
	
};

function getStatiAttivita(req, res){
	domainService.getStatiAttivita().then(function(statiAttivita){
		 res.send(statiAttivita);
	}).catch(function (err) {
            res.status(400).send(err);
	});
	
};


function addTipoDeliverable(req, res){
	domainService.addTipoDeliverable(req.body).then(function(){
		 res.sendStatus(200);
	}).catch(function (err) {
            res.status(400).send(err);
        });
	
};

function getTipiDeliverable(req, res){
	domainService.getTipiDeliverable().then(function(tipiDeliverable){
		 res.send(tipiDeliverable);
	}).catch(function (err) {
            res.status(400).send(err);
	});
	
};

function addStatoMeseConsuntivo(req, res){
	domainService.addStatoMeseConsuntivo(req.body).then(function(){
		 res.sendStatus(200);
	}).catch(function (err) {
            res.status(400).send(err);
        });
	
};

function getStatiMeseConsuntivo(req, res){
	domainService.getStatiMeseConsuntivo().then(function(statiMeseConsuntivo){
		 res.send(statiMeseConsuntivo);
	}).catch(function (err) {
            res.status(400).send(err);
	});
	
};

module.exports = routerDomain;
