const express = require('express');
const routerReportistica = express.Router();
var reportisticaService = require('services/reportistica.service');


routerReportistica.post('/download', getReportistica);

function getReportistica(req, res){
	reportisticaService.getReportistica(req.body, res).then( result =>{
		res.send(result);
	}).catch(function (err) {
        res.status(400).send(err);
    });
	
};

module.exports = routerReportistica;
