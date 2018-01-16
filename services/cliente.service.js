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
    
    let newCliente = new Cliente(clienteParam);
    console.log(newCliente);
    var query = {'_id':newCliente._id};


    Cliente.findOneAndUpdate(query, newCliente, {upsert:true, new: true}, function(err, doc){
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

	Cliente.find({"_id" : {$eq : idParam}},function (err, cliente) {
        if (err){
          deferred.reject(err.name + ': ' + err.message);  
      } else{
        deferred.resolve(cliente);
      }

    });

    return deferred.promise;
}