var _ = require('lodash');
var Q = require('q');
var dateFormat = require('dateformat');
var Excel = require('exceljs');

var serviceReportistica = {};

const Consuntivo = require('../models/consuntivo.js');

serviceReportistica.getReportistica = getReportistica;
serviceReportistica.getRowsForExcel = getRowsForExcel;

module.exports = serviceReportistica;

function getReportistica(reportisticaParam, res){
	var deferred = Q.defer();

	//https://github.com/guyonroche/exceljs
	var workbook = new Excel.Workbook();
	var sheet = workbook.addWorksheet("Report 1");
	

	res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
	res.setHeader("Content-Disposition", "attachment; filename=" + "Report.xlsx");
	workbook.xlsx.write(res)
		.then(function(){
			res.end();
			deferred.resolve({msg: 'XLS created successfully'});
		});
	
	return deferred.promise;
}

function getRowsForExcel(params, res){
	var deferred = Q.defer();

	let consuntivo = new Consuntivo(); 

	var start = dateFormat(new Date(params.start), "yyyy-dd-mm");
	var end = dateFormat(new Date(params.end), "yyyy-dd-mm");
    consuntivo.getRowsForExcel({start : new Date(start).toISOString(), end : new Date(end).toISOString(), res : res},function (err, reportistica) {
        
    });

    return deferred.promise;
}