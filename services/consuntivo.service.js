var _ = require('lodash');
var Q = require('q');
var dateFormat = require('dateformat');
const mongoose = require('mongoose');
const Fawn = require("fawn");

// intitialize Fawn
Fawn.init(mongoose);

var serviceConsuntivo = {};

const MeseConsuntivo = require('../models/meseConsuntivo.js');
const Consuntivo = require('../models/consuntivo.js');


//serviceConsuntivo.addMeseConsuntivo = addMeseConsuntivo;
serviceConsuntivo.getMeseConsuntivoCliente = getMeseConsuntivoCliente;
serviceConsuntivo.addConsuntivo = addConsuntivo;
serviceConsuntivo.getConsuntivoCliente = getConsuntivoCliente;
serviceConsuntivo.getConsuntiviBetweenDates = getConsuntiviBetweenDates;
serviceConsuntivo.getConsuntiviUtente = getConsuntiviUtente;
serviceConsuntivo.insOrUpdConsuntiviUtente = insOrUpdConsuntiviUtente;
serviceConsuntivo.delConsuntiviUtente =  delConsuntiviUtente;

module.exports = serviceConsuntivo;
/*
function addMeseConsuntivo(meseConsuntivoParam) {
    console.log("addMeseConsuntivo "+meseConsuntivoParam._id)
    var deferred = Q.defer();
    console.log (meseConsuntivoParam);
    let newMeseConsuntivo = new MeseConsuntivo(meseConsuntivoParam);
    console.log(newMeseConsuntivo);
    var query = {'_id':newMeseConsuntivo._id};
    MeseConsuntivo.findOneAndUpdate(query, newMeseConsuntivo, {upsert:true}, function(err, doc){
        if (err){
            deferred.reject(err.name + ': ' + err.message);
        }else{
             deferred.resolve({msg: 'MeseConsuntivo add successfully'});
        }
    });
     return deferred.promise;
}*/

//OK
function addConsuntivo(consuntivoParam) {
    console.log("addConsuntivo " + consuntivoParam._id)
    var deferred = Q.defer();
    consuntivoParam.data_consuntivo = consuntivoParam.data_consuntivo
    console.log(consuntivoParam.data_consuntivo);
    console.log(consuntivoParam);
    let newConsuntivo = new Consuntivo(consuntivoParam);
    console.log(newConsuntivo);
    var query = { '_id': newConsuntivo._id };
    Consuntivo.findOneAndUpdate(query, newConsuntivo, { upsert: true }, function (err, doc) {
        if (err) {
            deferred.reject(err.name + ': ' + err.message);
        } else {
            deferred.resolve({ msg: 'Consuntivo add successfully' });
        }
    });
    return deferred.promise;
}

function getMeseConsuntivoCliente(idCliente, anno, mese) {
    var deferred = Q.defer();
    console.log(idCliente + "-" + anno + "-" + mese);
    let meseConsuntivo = new MeseConsuntivo();
    meseConsuntivo.findByClienteAnnoAndMese({ idCliente: idCliente, anno: anno, mese: mese }, function (err, consuntivo) {
        if (err) {
            deferred.reject(err.name + ': ' + err.message);
        } else {
            deferred.resolve(consuntivo);
        }

    });

    return deferred.promise;
}


function getConsuntivoCliente(idCliente, data) {
    var deferred = Q.defer();

    let consuntivo = new Consuntivo();
    data = dateFormat(new Date(data), "yyyy-dd-mm");
    consuntivo.findByClienteAndData({ idCliente: idCliente, data: new Date(data).toISOString() }, function (err, consuntivo) {
        if (err) {
            deferred.reject(err.name + ': ' + err.message);
        } else {
            deferred.resolve(consuntivo);
        }

    });

    return deferred.promise;
}

function getConsuntiviBetweenDates(start, end) {
    var deferred = Q.defer();

    start = dateFormat(new Date(start), "yyyy-dd-mm");
    end = dateFormat(new Date(end), "yyyy-dd-mm");
    console.log("Dal: " + new Date(start).toISOString() + "Al: " + new Date(end).toISOString());
    let consuntivo = new Consuntivo();
    consuntivo.findBetweenDates({ start: new Date(start).toISOString(), end: new Date(end).toISOString() }, function (err, consuntivo) {
        if (err) {
            deferred.reject(err.name + ': ' + err.message);
        } else {
            deferred.resolve(consuntivo);
        }

    });

    return deferred.promise;
}


// function getConsuntiviUtente(id_user, month, year) {
//     var deferred = Q.defer();


//     let consuntivo = new Consuntivo();
//     consuntivo.getConsuntiviUtente({ start: new Date(start).toISOString(), end: new Date(end).toISOString() }, function (err, consuntivo) {
//         if (err) {
//             deferred.reject(err.name + ': ' + err.message);
//         } else {
//             deferred.resolve(consuntivo);
//         }

//     });

//     return deferred.promise;
// }

//OK
function getConsuntiviUtente(id_user, month, year) {
    var deferred = Q.defer();
    console.log("user: " + id_user + " month: " + month + "/" + year);
    let consuntivo = new Consuntivo();
    
    mongoose.set('debug', true);
	var query = [
		{
			$project:
			{
				doc: "$$ROOT",
				year: { $cond: ["$data_consuntivo", { $year: "$data_consuntivo" }, -1] },
				month: { $cond: ["$data_consuntivo", { $month: "$data_consuntivo" }, -1] },
				day: { $cond: ["$data_consuntivo", { $dayOfMonth: "$data_consuntivo" }, -1] },
				user: "$id_utente"
			}
		},
		{
			$match: {
				"month": new Number(month).valueOf(),
				"year": new Number(year).valueOf(),
				"user": id_user
			}
        },
        {
            $replaceRoot: { newRoot: "$doc" }
        },
	];

	return Consuntivo.aggregate(query).exec((err, consuntiviUtente)=> {
        if (err) {
            deferred.reject(err.name + ': ' + err.message);
        } else {            
            deferred.resolve(consuntiviUtente);
        }

    });

    return deferred.promise;
}

//OK
function insOrUpdConsuntiviUtente(consuntiviUtente) {
    console.log("insOrUpdConsuntiviUtente");

    var deferred = Q.defer();
    var transaction = Fawn.Task();
    var query;
    //transaction.initModel("Consuntivo", this.Consuntivo);
    mongoose.set('debug', true);
    
    for (var i = 0; i < consuntiviUtente.body.length; i++) {   
        var id = consuntiviUtente.body[i]._id;
        var object = _.omit(consuntiviUtente.body[i], '_id');  
        object = _.omit(consuntiviUtente.body[i], '__v');    
        if(id != null){            
            transaction.update(Consuntivo, {_id: id}, object).options({upsert: true});
        }else{
            transaction.save(Consuntivo, object);
        }
    }

    transaction.run({useMongoose: true}).then(function(results){
            console.log(results[0].result);
            //deferred.resolve(results[0].result);
            deferred.resolve({msg: 'ConsuntiviUtente add successfully'});
        })
        .catch(function(err){
        // Everything has been rolled back.			
        // log the error which caused the failure
            console.log(err);
            deferred.reject(err);
        });

    return deferred.promise;
}

//OK
function delConsuntiviUtente(id_user, 
                             id_macro_area, 
                             id_ambito, 
                             id_attivita,
                             id_tipo_deliverable) {
    var deferred = Q.defer();
    console.log("delConsuntivi");
    let consuntivo = new Consuntivo();
 
    mongoose.set('debug', true);
    consuntivo.remove({ "id_user": new Number(id_user), 
                        "id_macro_area": new Number(id_macro_area), 
                        "id_ambito": new Number(id_ambito), 
                        "id_tipo_deliverable": new Number(id_tipo_deliverable) }, function(err, doc) {

        if (err) {
            deferred.reject(err.name + ': ' + err.message);
        } else {      
            deferred.resolve({ msg: 'Consuntivi deleted successfully' });
        }

    });
     
    return deferred.promise;
l}

