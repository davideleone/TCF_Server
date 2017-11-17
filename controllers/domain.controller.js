const express = require('express');
const routerDomain = express.Router();
var domainService = require('services/domain.service');


routerDomain.get('/getDomainList/:system/:subsystem/:funct', getDomainList);

function getDomainList(req, res){
	domainService.getDomainList(req.params.system, req.params.subsystem, req.params.funct).then(function(domains){
		 res.send(domains);
	}).catch(function (err) {
            res.status(400).send(err);
	});
	
};


module.exports = routerDomain;
