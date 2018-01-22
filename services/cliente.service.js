var _ = require('lodash');
var Q = require('q');


var serviceCliente= {};


const Cliente = require('../models/cliente.js');

serviceCliente.addCliente = addCliente;
serviceCliente.getClienti = getClienti;
serviceCliente.getClienteById = getClienteById;

module.exports = serviceCliente;

function addCliente(clienteParam) {
    var deferred = Q.defer();
	if(clienteParam.data_inizio_validita == undefined)
		clienteParam.data_inizio_validita = Date.now();
    
    let inputCliente = new Cliente(clienteParam);
    var query = {'_id':inputCliente._id};

    getClienteById(inputCliente._id).then(cliente => {

        //INSERT
        if(cliente == null){
            countClientiByName(inputCliente.nome_cliente).then(count => {
                if ((count == 1 && cliente != null) || count == 0) 
                    findOneAndUpdate(query, newCliente).then(res => deferred.resolve(res));
                    else
                deferred.reject("Non è possibile inserire più clienti con lo stesso nome")
            })
        }
        //UPDATE
        else{
            countClientiByName(inputCliente.nome_cliente).then(count => {
                if(count == 1){
                    getClienteByNomeCliente(inputCliente.nome_cliente).then(clienteInEdit => {
        
                        //CONFRONTO ID in input con ID oggetto già esistente in DB
                        if(clienteInEdit._id.equals(inputCliente._id))
                            findOneAndUpdate({_id: inputCliente.id}, inputCliente).then(res => deferred.resolve(res));
                        else
                            deferred.reject("Non è possibile inserire più clienti con lo stesso nome")
                    })
                }
                else
                    deferred.reject("Non è possibile inserire più clienti con lo stesso nome")
            })
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

function getClienti() {
    var deferred = Q.defer();

    let cliente = new Cliente();

    cliente.findAll({},function (err, clienti) {
        if (err){
          deferred.reject(err.name + ': ' + err.message);  
      } else{
        deferred.resolve(clienti);
      }

    });

    return deferred.promise;
}

function getClienteById(idParam) {
    var deferred = Q.defer();

	Cliente.findById({"_id" : idParam },function (err, cliente) {
        if (err)
            deferred.reject(err.name + ': ' + err.message);  
        else
            deferred.resolve(cliente);
    });

    return deferred.promise;
}

function getClienteByNomeCliente(nome){
    var deferred = Q.defer();
    
    Cliente.findOne({"nome_cliente" : nome}, function(err, doc){
        if (err)
            deferred.reject(err.name + ': ' + err.message);
        else 
            deferred.resolve(doc);
    });

    return deferred.promise;
}

function findOneAndUpdate(query ,newCliente){
    var deferred = Q.defer();
    Cliente.findOneAndUpdate(query, newCliente, { upsert: true, new: true }, function (err, doc) {
        if (err)
            deferred.reject(err.name + ': ' + err.message);
        else
            deferred.resolve(doc);
    });
    return deferred.promise;
}