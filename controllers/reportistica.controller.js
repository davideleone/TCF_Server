const express = require('express');
const routerReportistica = express.Router();
var reportisticaService = require('services/reportistica.service');


routerReportistica.post('/reportistica', getReportistica);
routerReportistica.post('/rowsForExcel', getRowsForExcel);

function getReportistica(req, res){
	reportisticaService.getReportistica(req.body, res).then(function(){
		 res.sendStatus(200);
	}).catch(function (err) {
            res.status(400).send(err);
        });
	
};

function getRowsForExcel(req, res){
	reportisticaService.getRowsForExcel(req.body, res).then(function(){
		 res.sendStatus(200);
	}).catch(function (err) {
            res.status(400).send(err);
        });
	
};

module.exports = routerReportistica;
