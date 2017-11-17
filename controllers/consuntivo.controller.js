const express = require('express');
const routerConsuntivo = express.Router();
var consuntivoService = require('services/consuntivo.service');


//routerConsuntivo.post('/meseConsuntivo', addMeseConsuntivo);

/*routerConsuntivo.post('/consuntivo', addConsuntivo);*/
routerConsuntivo.post('/consuntiviTraDate', getConsuntiviBetweenDates);
//CRUD
routerConsuntivo.post('/consuntiviUtente', insOrUpdConsuntiviUtente); 			//CREATE-UPDATE
routerConsuntivo.get('/consuntiviUtente/:id_user/:month/:year', getConsuntiviUtente);  //READ
routerConsuntivo.delete('/consuntiviUtente/:id_user/:id_macro_area/:id_ambito/:id_attivita/:id_tipo_deliverable', delConsuntiviUtente);				//DELETE


function addMeseConsuntivo(req, res){
	consuntivoService.addMeseConsuntivo(req.body).then(function(){
		 res.sendStatus(200);
	}).catch(function (err) {
            res.status(400).send(err);
        });	
};

function getMeseConsuntivoUtente(req, res){
	consuntivoService.getConsuntiviUtente(req.params.idCliente, req.params.mese, req.params.anno ).then(function(consuntiviUtente){
		 res.send(consuntiviUtente);
	}).catch(function (err) {
            res.status(400).send(err);
	});
	
};

//CRUD - CREATE single
function addConsuntivo(req, res){
	consuntivoService.addConsuntivo(req.body).then(function(){
		 res.sendStatus(200);
	}).catch(function (err) {
            res.status(400).send(err);
        });
	
};
//CRUD - READ single
function getConsuntivoCliente(req, res){
	consuntivoService.getConsuntivoCliente(req.params.id_user, req.params.date).then(function(consuntivo){
		 res.send(consuntivo);
	}).catch(function (err) {
            res.status(400).send(err);
	});
	
};
//READ multiple
function getConsuntiviBetweenDates(req, res){
	consuntivoService.getConsuntiviBetweenDates(req.body.start, req.body.end).then(function(consuntivi){
		 res.send(consuntivi);
	}).catch(function (err) {
            res.status(400).send(err);
	});
	
};

//CRUD - READ multiple
function getConsuntiviUtente(req, res){
	consuntivoService.getConsuntiviUtente(req.params.id_user, req.params.month, req.params.year).then(function(consuntivi){
		 res.send(consuntivi);
	}).catch(function (err) {
            res.status(400).send(err);
	});
	
};

//CRUD - CREATE/UPDATE  multiple
function insOrUpdConsuntiviUtente(req, res){
	consuntivoService.insOrUpdConsuntiviUtente(req).then(function(msg){
		console.log("consuntivo.controller.modifyConsuntiviUtente: ok");
		res.send(msg);
	}).catch(function (err) {
            res.status(400).send(err);
	});	
};

//CRUD - DELETE  multiple
function delConsuntiviUtente(req, res){
	consuntivoService.delConsuntiviUtente(	req.params.id_user, 
											req.params.id_macro_area, 
											req.params.id_ambito, 
											req.params.id_attivita,
											req.params.id_tipo_deliverable 
										).then(function(msg){
		console.log("consuntivo.controller.delConsuntiviUtente: ok");
		res.send(msg);
	}).catch(function (err) {
            res.status(400).send(err);
	});	
};

module.exports = routerConsuntivo;
