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

	var formattedParams = {
		start: dateFormat(new Date(params.start), "yyyy-dd-mm"),
		end: dateFormat(new Date(params.end), "yyyy-dd-mm"),
		type: params.type,
		clientId: params.clientId
	}

	switch(formattedParams.type){
		case 'r_totale':
			consuntivoService.getReportTotale(formattedParams.clientId, formattedParams.end, formattedParams.end).then( res =>{
				deferred.resolve(res);
			})
			break;
		case 'r_attivita':
			consuntivoService.getReportAttivita(formattedParams.clientId, formattedParams.end, formattedParams.end).then( res =>{
				deferred.resolve(res);
			})
			break;
		default:
			deferred.reject("Non esiste report di tipo " + formattedParams.type);
	}

	return deferred.promise;
}
