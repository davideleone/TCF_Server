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
serviceConsuntivo.delConsuntiviUtente = delConsuntiviUtente;
serviceConsuntivo.getReportAttivita = getReportAttivita;
serviceConsuntivo.getReportTotale = getReportTotale;

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
    let newConsuntivo = new Consuntivo(consuntivoParam);

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
                "user": mongoose.Types.ObjectId(id_user)
            }
        },
        {
            $replaceRoot: { newRoot: "$doc" }
        },
    ];

    return Consuntivo.aggregate(query).exec((err, consuntiviUtente) => {
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

    for (var i = 0; i < consuntiviUtente.length; i++) {
        var dataConsuntivo = consuntiviUtente[i].data_consuntivo;
        var idAttivita = consuntiviUtente[i].id_attivita;
        var user = consuntiviUtente[i].id_utente;
        var deliverable = consuntiviUtente[i].id_tipo_deliverable;
        var object = _.omit(consuntiviUtente[i], '_id');
        object = _.omit(consuntiviUtente[i], '__v');
        transaction.update(Consuntivo, {
            data_consuntivo: dataConsuntivo,
            id_utente: user,
            id_attivita: idAttivita,
            id_tipo_deliverable: deliverable,
        }, object).options({ upsert: true });
    }

    transaction.run({ useMongoose: true }).then(function (results) {
        deferred.resolve({ msg: 'ConsuntiviUtente add successfully' });
    })
    .catch(function (err) {
        console.log(err);
        deferred.reject(err);
    });

    return deferred.promise;
}

//OK
function delConsuntiviUtente( dataInizio,
    dataFine,
    id_user,
    id_macro_area,
    id_ambito,
    id_attivita,
    id_tipo_deliverable) {

    var deferred = Q.defer();
    console.log("delConsuntivi");

    let consuntivo = new Consuntivo();

    Consuntivo.remove({
        "id_utente": id_user,
        "id_macro_area": id_macro_area,
        "id_ambito": id_ambito,
        "id_tipo_deliverable": id_tipo_deliverable,
        "data_consuntivo": {
            $gte: new Date(dataInizio), $lte: new Date(dataFine)
        }
    }).exec((err, doc) => {

        if (err) {
            deferred.reject(err.name + ': ' + err.message);
        } else {
            deferred.resolve(doc);
            //deferred.resolve({ msg: 'Consuntivi deleted successfully' });
        }

    });

    return deferred.promise;
}

function getReportAttivita(id_cliente, data_inizio, data_fine) {
    var deferred = Q.defer();
    let consuntivo = new Consuntivo();

    mongoose.set('debug', true);
    var query = [
        // Stage 1
        {
            $match: {
                "id_cliente": mongoose.Types.ObjectId(id_cliente),
                "data_consuntivo": {
                    $gte: new Date(data_inizio), $lte: new Date(data_fine)
                }
            }
        },
        {
            $lookup: {
                "from": mongoose.model('Attivita').collection.collectionName,
                "localField": "id_attivita",
                "foreignField": "_id",
                "as": "attivita"
            }
        },

        // Stage 2
        {
            $unwind: {
                path: "$attivita",
                preserveNullAndEmptyArrays: false // optional
            }
        },

        // Stage 3
        {
            $lookup: {
                "from": mongoose.model('CommessaCliente').collection.collectionName,
                "localField": "attivita.id_commessa_cliente",
                "foreignField": "_id",
                "as": "commessa_cliente"
            }
        },

        // Stage 4
        {
            $unwind: {
                path: "$commessa_cliente",
                preserveNullAndEmptyArrays: false // optional
            }
        },

        // Stage 5
        {
            $lookup: {
                "from": mongoose.model('CommessaFincons').collection.collectionName,
                "localField": "commessa_cliente.id_commessa_fnc",
                "foreignField": "_id",
                "as": "commessa_fincons"
            }
        },

        // Stage 6
        {
            $unwind: {
                path: "$commessa_fincons",
                preserveNullAndEmptyArrays: false // optional
            }
        },
        {
            $group: {
                "_id": {
                    nome_cliente: "$nome_cliente",
                    nome_ambito: "$nome_ambito",
                    nome_macro_area: "$nome_macro_area",
                    nome_attivita: "$attivita.nome_attivita",
                    codice_commessa_cliente: "$commessa_cliente.codice_commessa",
                    nome_commessa_cliente: "$commessa_cliente.nome_commessa",
                    codice_attivita: "$attivita.codice_attivita",
                    codice_commessa_fnc: "$commessa_fincons.codice_commessa",
                    nome_commessa_fnc: "$commessa_fincons.nome_commessa",
                    descrizione_attivita: "$attivita.descrizione_attivita",
                    stato_attivita: "$attivita.nome_stato",
                    budget_euro: "$attivita.budget_euro",
                    budget_ore: "$attivita.budget_ore",
                    data_inizio: "$attivita.data_inizio_validita",
                    data_fine: "$attivita.data_fine_validita"
                }
            }
        },
        // Stage 7
        {
            $project: {
                _id: 0,
                nome_cliente: "$_id.nome_cliente",
                nome_ambito: "$_id.nome_ambito",
                nome_macro_area: "$_id.nome_macro_area",
                nome_attivita: "$_id.nome_attivita",
                codice_commessa_cliente: "$_id.codice_commessa_cliente",
                nome_commessa_cliente: "$_id.nome_commessa_cliente",
                codice_attivita: "$_id.codice_attivita",
                codice_commessa_fnc: "$_id.codice_commessa_fnc",
                nome_commessa_fnc: "$_id.nome_commessa_fnc",
                descrizione_attivita: "$_id.descrizione_attivita",
                stato_attivita: "$_id.stato_attivita",
                budget_euro: "$_id.budget_euro",
                budget_ore: "$_id.budget_ore",
                data_inizio: "$_id.data_inizio",
                data_fine: "$_id.data_fine"
            }
        }

    ];

    Consuntivo.aggregate(query).exec((err, consuntiviUtente) => {
        if (err) {
            deferred.reject(err.name + ': ' + err.message);
        } else {
            deferred.resolve(consuntiviUtente);
        }

    });

    return deferred.promise;
}



function getReportTotale(id_cliente, data_inizio, data_fine) {
    var deferred = Q.defer();
    let consuntivo = new Consuntivo();

    mongoose.set('debug', true);
    var query = [
        // Stage 1
        {
            $match: {
                "id_cliente": mongoose.Types.ObjectId(id_cliente),
                "data_consuntivo": {
                    $gte: new Date(data_inizio), $lte: new Date(data_fine)
                }
            }
        },
        {
            $lookup: {
                "from": mongoose.model('User').collection.collectionName,
                "localField": "id_utente",
                "foreignField": "_id",
                "as": "utente"
            }
        },
        // Stage 2
        {
            $unwind: {
                path: "$utente",
                preserveNullAndEmptyArrays: false // optional
            }
        },
        // Stage 3
        {
            $lookup: {
                "from": mongoose.model('Attivita').collection.collectionName,
                "localField": "id_attivita",
                "foreignField": "_id",
                "as": "attivita"
            }
        },
        // Stage 4
        {
            $unwind: {
                path: "$attivita",
                preserveNullAndEmptyArrays: false // optional
            }
        },
        // Stage 5
        {
            $lookup: {
                "from": mongoose.model('CommessaCliente').collection.collectionName,
                "localField": "attivita.id_commessa_cliente",
                "foreignField": "_id",
                "as": "commessa_cliente"
            }
        },
        // Stage 6
        {
            $unwind: {
                path: "$commessa_cliente",
                preserveNullAndEmptyArrays: false // optional
            }
        },
        // Stage 7
        {
            $lookup: {
                "from": mongoose.model('CommessaFincons').collection.collectionName,
                "localField": "commessa_cliente.id_commessa_fnc",
                "foreignField": "_id",
                "as": "commessa_fincons"
            }
        },
        // Stage 8
        {
            $unwind: {
                path: "$commessa_fincons",
                preserveNullAndEmptyArrays: false // optional
            }
        },
        {
            $group: {
                "_id": {
                    data_consuntivo: "$data_consuntivo",
                    id_attivita: "$id_attivita",
                    id_tipo_deliverable: "$id_tipo_deliverable",
                    id_utente: "$id_utente",
                    nome_cliente: "$nome_cliente",
                    nome_ambito: "$nome_ambito",
                    nome_macro_area: "$nome_macro_area",
                    codice_commessa_cliente: "$commessa_cliente.codice_commessa",
                    nome_commessa_cliente: "$commessa_cliente.nome_commessa",
                    codice_attivita: "$attivita.codice_attivita",
                    codice_commessa_fnc: "$commessa_fincons.codice_commessa",
                    nome_attivita: "$attivita.nome_attivita",
                    budget_gg: "$commessa_cliente.budget_gg",
                    type_of_work: "$nome_tipo_deliverable",
                    cognome: "$utente.cognome",
                    nome: "$utente.nome",
                    note: "$note"
                },
                tot_ore: { $sum: "$ore" }
            }
        },
        {
            $project: {
                _id: 0,
                nome_cliente: "$_id.nome_cliente",
                nome_ambito: "$_id.nome_ambito",
                nome_macro_area: "$_id.nome_macro_area",
                codice_commessa_cliente: "$_id.codice_commessa_cliente",
                nome_commessa_cliente: "$_id.nome_commessa_cliente",
                codice_attivita: "$_id.codice_attivita",
                codice_commessa_fnc: "$_id.codice_commessa_fnc",
                nome_attivita: "$_id.nome_attivita",
                budget_gg: "$_id.budget_gg",
                type_of_work: "$_id.type_of_work",
                cognome: "$_id.cognome",
                nome: "$_id.nome",
                tot_ore: "$tot_ore",
                tot_giorni: { $divide: [ "$tot_ore", 8 ] } ,
                data_consuntivo: "$_id.data_consuntivo",
                note: "$_id.note"
            }
        },
        {
            $match: {
                "tot_ore": { $ne: 0 },
            }
        }

    ];

    Consuntivo.aggregate(query).exec((err, consuntiviUtente) => {
        if (err) {
            deferred.reject(err.name + ': ' + err.message);
        } else {
            deferred.resolve(consuntiviUtente);
        }
    });

    return deferred.promise;
}
