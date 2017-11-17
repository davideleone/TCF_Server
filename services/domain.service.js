var _ = require('lodash');
var Q = require('q');


var serviceDomain = {};


const Domain = require('../models/domain.js');

serviceDomain.getDomainList = getDomainList;

module.exports = serviceDomain;


function getDomainList(system, subsystem, funct) {
    var deferred = Q.defer();
    
        
        var query = [
            {
                "$match": {	
                            "system": system, 
                            "subsystem": subsystem, 
                            "funct": funct
                        }
            },
            {
                "$project":
                {
                    label: "$key",
                    value: "$value",
                    _id: 0
                }
            }
            
        ];
    
        return Domain.aggregate(query).exec((err, domain)=> {
            if (err) {
                deferred.reject(err.name + ': ' + err.message);
            } else {            
                deferred.resolve(domain);
            }
    
        });

        return deferred.promise;
    }

