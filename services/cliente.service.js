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
    var query = {'_id':newCliente._id};

    getClienteById(newCliente._id).then(cliente => {

        countClientiByName(newCliente.nome_cliente).then(count => {

            if ((count == 1 && cliente != null) || count == 0) {
                Cliente.findOneAndUpdate(query, newCliente, { upsert: true, new: true }, function (err, doc) {
                    if (err)
                        deferred.reject(err.name + ': ' + err.message);
                    else
                        deferred.resolve(doc);
                });
            }
            else
                deferred.reject("Non è possibile inserire clienti con lo stesso nome")
        });
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