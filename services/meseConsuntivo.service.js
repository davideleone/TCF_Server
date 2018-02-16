var _ = require('lodash');
var Q = require('q');
const mongoose = require('mongoose');

var serviceMeseConsuntivo = {};

const MeseConsuntivo = require('../models/meseConsuntivo.js');

serviceMeseConsuntivo.insOrUpdMeseConsuntivoUtente = insOrUpdMeseConsuntivoUtente;
serviceMeseConsuntivo.getById = getById;
serviceMeseConsuntivo.getByYear = getByYear;

function insOrUpdMeseConsuntivoUtente(meseConsuntivoParam) {
    console.log("insOrUpdMeseConsuntivo "+meseConsuntivoParam._id)
    var deferred = Q.defer();

    let newMeseConsuntivo = new MeseConsuntivo(meseConsuntivoParam);
    var query = {'_id': mongoose.Types.ObjectId(newMeseConsuntivo._id)};
    
    MeseConsuntivo.findOneAndUpdate(query, newMeseConsuntivo, {upsert:true}, function(err, doc){
        if (err){
            deferred.reject(err.name + ': ' + err.message);
        }else{
             deferred.resolve({msg: 'MeseConsuntivo insOrUpd successfully'});
        }
    });
     return deferred.promise;
}


function getById(_id) {
    var deferred = Q.defer();

    MeseConsuntivo.findById(new Number(_id), function (err, user) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (user) {
            // return user (without hashed password)
            deferred.resolve(_.omit(user, ['_doc.password']));
        } else {
            // user not found
            deferred.resolve("Not Found");
        }
    });

    return deferred.promise;
}

function getByYear(id_user, year) {
    var deferred = Q.defer();
    console.log("utente: " + id_user + " getMesiConsuntiviUtente: " + year);
    

    MeseConsuntivo.find({id_utente: id_user, anno_consuntivo: year }, function (err, mesiConsuntivi) {
        if (err) {
            deferred.reject(err.name + ': ' + err.message);
        } else {
            deferred.resolve(mesiConsuntivi);
        }
    });

    return deferred.promise;
}

function countClientiByName(name){
    var deferred = Q.defer();
    
    Cliente.find({"nome_cliente" : name}).count( function(err, doc){
        if (err)
            deferred.reject(err.name + ': ' + err.message);
        else 
            deferred.resolve(doc);
    });

    return deferred.promise;
}

//CRUD - DELETE
function delMeseConsuntivoUtente(id) {
    var deferred = Q.defer();

    MeseConsuntivo.remove(
        { _id: id },
        function (err, doc) {
            if (err){
              deferred.reject(err.name + ': ' + err.message);
            }else{
                deferred.resolve(doc);
            }
        });

    return deferred.promise;
}

module.exports = serviceMeseConsuntivo;