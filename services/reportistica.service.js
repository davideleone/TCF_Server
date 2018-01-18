var _ = require('lodash');
var Q = require('q');
var dateFormat = require('dateformat');
var Excel = require('exceljs');

var serviceReportistica = {};

const consuntivoService = require('./consuntivo.service');


serviceReportistica.getReportistica = getReportistica;

module.exports = serviceReportistica;

function getReportistica(params, res){
	var deferred = Q.defer();

	switch(params.type){
		case 'r_totale':
			consuntivoService.getReportTotale(params.clientId, params.start, params.end).then( res =>{
				deferred.resolve(res);
			})
			break;
		case 'r_attivita':
			consuntivoService.getReportAttivita(params.clientId, params.start, params.end).then( res =>{
				deferred.resolve(res);
			})
			break;
		default:
			deferred.reject("Non esiste report di tipo " + params.type);
	}

	return deferred.promise;
}
