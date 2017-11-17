var _ = require('lodash');
var Q = require('q');
var dateFormat = require('dateformat');
var excelbuilder = require('msexcel-builder');

var serviceReportistica = {};

const Consuntivo = require('../models/consuntivo.js');

serviceReportistica.getReportistica = getReportistica;
serviceReportistica.getRowsForExcel = getRowsForExcel;

module.exports = serviceReportistica;

function getReportistica(reportisticaParam){
	var deferred = Q.defer();

	var workbook = excelbuilder.createWorkbook("C:/Users/luca.massa/Desktop/", "file.xlsx");

	// Create a new worksheet with 10 columns and 12 rows 
	var sheet1 = workbook.createSheet('sheet1', 10, 12);

	// Fill some data 
	sheet1.set(1, 1, 'I am title');
	for (var i = 2; i < 5; i++)
	  sheet1.set(i, 1, 'test'+i);

	// Save it 
	workbook.save(function(ok){
	  if (!ok) 
		  deferred.reject({msg: 'Error. XLS doesn\'t created'});
	  else
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