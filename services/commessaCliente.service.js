const CommessaCliente = require('../models/commessaCliente.js');
var _ = require('lodash');
var Q = require('q');

var serviceCommessaCliente= {};


serviceCommessaCliente.addOrUpdateCommessaCliente = addOrUpdateCommessaCliente;


function addOrUpdateCommessaCliente(params) {
    
    let deferred = Q.defer();

    let newCommessaCliente = new CommessaCliente(params);
    var query = {'_id': newCommessaCliente._id};

    getById(newCommessaCliente._id).then(commessa => {
        
        //console.log(commessa)
        countCommessaByCodiceCommessa(newCommessaCliente.codice_commessa).then(count => {
            console.log(count)
            if ((count == 1 && commessa != null) || count == 0) 
                findOneAndUpdate(query, newCommessaCliente).then(res => deferred.resolve(res));
            else
                deferred.reject("Non è possibile inserire commesse con lo stesso codice commessa")
        });
    });

    return deferred.promise;
}

function findOneAndUpdate(query, newCommessa){
    var deferred = Q.defer();
    CommessaCliente.findOneAndUpdate(query, newCommessa, {new: true, upsert:true}, function (err, doc) {
        if (err)
            deferred.reject(err);
        else
            deferred.resolve(doc);
    });
    return deferred.promise;
}

function countCommessaByCodiceCommessa(cod){
    var deferred = Q.defer();
    
    CommessaCliente.find({"codice_commessa" : cod}).count( function(err, doc){
        if (err)
            deferred.reject(err.name + ': ' + err.message);
        else 
            deferred.resolve(doc);
    });

    return deferred.promise;
}

function getById(idParam) {
    var deferred = Q.defer();

	CommessaCliente.findById({"_id" : idParam },function (err, cliente) {
        if (err)
            deferred.reject(err.name + ': ' + err.message);  
        else
            deferred.resolve(cliente);
    });

    return deferred.promise;
}

module.exports = serviceCommessaCliente;
