const CommessaCliente = require('../models/commessaCliente.js');
var _ = require('lodash');
var Q = require('q');
const mongoose = require('mongoose');

var serviceCommessaCliente= {};


serviceCommessaCliente.addOrUpdateCommessaCliente = addOrUpdateCommessaCliente;
serviceCommessaCliente.getCommessaAll = getCommessaAll;

function addOrUpdateCommessaCliente(params) {
    
    let deferred = Q.defer();
    let commessaInput = new CommessaCliente(params);

    getById(commessaInput._id).then(commessa => {
 
        //INSERT
        if(commessa == null){
            countCommessaByCodiceCommessa(commessaInput.codice_commessa).then(count =>{
                if(count == 0)
                    findOneAndUpdate({_id: commessaInput.id}, commessaInput).then(res => deferred.resolve(res));
                else
                    deferred.reject("Non è possibile inserire più commesse con lo stesso codice commessa")
            })
        }
    
        //UPDATE
        else{
            countCommessaByCodiceCommessa(commessaInput.codice_commessa).then(count =>{
                if(count == 1 ){
                    getCommessaByCodiceCommessa(commessaInput.codice_commessa).then(commessaInEdit => {
        
                        //CONFRONTO ID in input con ID oggetto già esistente in DB
                        if(commessaInEdit._id.equals(commessaInput._id))
                            findOneAndUpdate({_id: commessaInput.id}, commessaInput).then(res => deferred.resolve(res));
                        else
                            deferred.reject("Non è possibile inserire più commesse con lo stesso codice commessa")
                    })
                }
                else if(count == 0)
                    findOneAndUpdate({ _id: commessaInput.id }, commessaInput).then(res => deferred.resolve(res));
                else
                    deferred.reject("Presenti duplicati");
            })
        }
        

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

function getCommessaByCodiceCommessa(cod){
    var deferred = Q.defer();
    
    CommessaCliente.findOne({"codice_commessa" : cod}, function(err, doc){
        if (err)
            deferred.reject(err.name + ': ' + err.message);
        else 
            deferred.resolve(doc);
    });

    return deferred.promise;
}

function getById(idParam) {
    var deferred = Q.defer();

	CommessaCliente.findById({"_id" : idParam },function (err, Cliente) {
        if (err)
            deferred.reject(err.name + ': ' + err.message);  
        else
            deferred.resolve(Cliente);
    });

    return deferred.promise;
}

function getCommessaAll(){
    var deferred = Q.defer();
    CommessaCliente.find({}, function(err, activity){
        if(err)
            deferred.reject(err.name + ': ' + err.message); 
        else
            deferred.resolve(activity);     
    } );
    return deferred.promise;
}

module.exports = serviceCommessaCliente;
