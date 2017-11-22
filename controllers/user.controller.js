const express = require('express');
const routerUser = express.Router();
var userService = require('../services/user.service');


routerUser.post('/authenticate', authenticate);

routerUser.post('/userChangeEmail', changeUserEmail);
routerUser.post('/userChangePwd', changeUserPwd);
routerUser.get('/userByManager/:userLogged', getUsersByManager);
routerUser.post('/insOrUpdUser', insOrUpdUser); 			//CREATE-UPDATE


//SECURITY SECTION - START
function authenticate(req, res) {
    userService.authenticate(req.body.username, req.body.password)
        .then(function (user) {
            if (user) {
                // authentication successful
                res.send(user);
            } else {
                // authentication failed
                res.status(400).send('Username o password non corrette');
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function changeUserEmail(req, res) {
	console.log("user.controller.changeUserEmail");
	
	userService.changeUserEmail(req.body.username, req.body.newEmail)
		.then(function(msg){

			console.log("user.controller.changeUserEmail: ok");
            res.send(msg);
		}).catch(function (err) {
			console.log("user.controller.changeUserEmail: fail");
		   	res.status(400).send(err);
		});
	
}

function changeUserPwd(req, res) {
    userService.changeUserPwd(req.body.userLogged, req.body.oldPwd, req.body.newPwd)
		.then(function(msg){
			console.log("user.controller.changeUserPwd: ok");
			res.send(msg);
		}).catch(function (err) {
			console.log("user.controller.changeUserPwd: fail");
			res.status(400).send(err);
		});
};
//SECURITY SECTION - END

function getUsersByManager(req, res){
	
	userService.getUsersByManager(req.params.userLogged).then(function(users){		 
		console.log("controller:  " + JSON.stringify(users)); 
		res.send(users);
	}).catch(function (err) {
		res.status(400).send(err);
	});
};

function insOrUpdUser(req, res){
	userService.insOrUpdUser(req.body).then(function(msg){
		console.log("user.controller.insOrUpdUser: ok");
		res.send(msg);
	}).catch(function (err) {
            res.status(400).send(err);
	});	
};

module.exports = routerUser;
