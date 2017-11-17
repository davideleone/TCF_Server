const express = require('express');
const routerMeseConsuntivo = express.Router();
var meseConsuntivoService = require('services/meseConsuntivo.service');


routerMeseConsuntivo.post('/meseConsuntivoUtente', insOrUpdMeseConsuntivoUtente);
routerMeseConsuntivo.get('/meseConsuntivoUtente/:id', getMeseConsuntivoUtente);
routerMeseConsuntivo.get('/mesiConsuntiviUtente/:id_user/:year', getMesiConsuntiviUtente);


function insOrUpdMeseConsuntivoUtente(req, res){
	meseConsuntivoService.insOrUpdMeseConsuntivoUtente(req.body).then(function(){
		 res.sendStatus(200);
	}).catch(function (err) {
            res.status(400).send(err);
        });	
};

function getMeseConsuntivoUtente(req, res){
	meseConsuntivoService.getById(req.params.id).then(function(meseConsuntivoUtente){
		 res.send(meseConsuntivoUtente);
	}).catch(function (err) {
            res.status(400).send(err);
	});
	
};

function getMesiConsuntiviUtente(req, res){
	meseConsuntivoService.getByYear(req.params.id_user, req.params.year).then(function(consuntiviUtente){
		 res.send(consuntiviUtente);
	}).catch(function (err) {
            res.status(400).send(err);
	});
	
};


module.exports = routerMeseConsuntivo;
