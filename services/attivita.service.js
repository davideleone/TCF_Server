var _ = require('lodash');
var Q = require('q');


var serviceAttivita= {};


const Attivita = require('../models/attivita.js');

serviceAttivita.addAttivita = addAttivita;
serviceAttivita.getAttivitaById = getAttivitaById;
serviceAttivita.getAttivitaAll = getAttivitaAll;
module.exports = serviceAttivita;

function addAttivita(attivitaParam) {
    var deferred = Q.defer();
    
    let newAttivita = new Attivita(attivitaParam);
    var query = {'_id':newAttivita._id};

    getAttivitaById(newAttivita._id).then(Attivita => {

        countAttivitaByName(newAttivita.nome_attivita).then(count => {
            if ((count == 1 && attivita != null) || count == 0) 
                findOneAndUpdate(query, newAttivita).then(res => deferred.resolve(res));
            else
                deferred.reject("Non è possibile inserire attività con lo stesso nome")
        });
    });

    return deferred.promise;
}

function countAttivitaByName(name){
    var deferred = Q.defer();
    
    Attivita.find({"nome_attivita" : name}).count( function(err, doc){
        if (err)
            deferred.reject(err.name + ': ' + err.message);
        else 
            deferred.resolve(doc);
    });

    return deferred.promise;
}

function getAttivitaById(idParam) {
    var deferred = Q.defer();

	Attivita.findById({"_id" : idParam },function (err, attivita) {
        if (err)
            deferred.reject(err.name + ': ' + err.message);  
        else
            deferred.resolve(attivita);
    });

    return deferred.promise;
}

function getAttivitaAll(){
    var deferred = Q.defer();
    Attivita.find({}, function(err, activity){
        if(err)
            deferred.reject(err.name + ': ' + err.message); 
        else
            deferred.resolve(activity);     
    } );
    return deferred.promise;
}