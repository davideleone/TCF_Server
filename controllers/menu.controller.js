const express = require('express');
const routerMenu = express.Router();
var menuService = require('../services/menu.service');


routerMenu.get('/getMenuList/:userLogged', getMenu);


//getmenulist
function getMenu(req, res){
	menuService.getAll(req.param.userLogged).then(function(menuList){		 
        res.send(menuList);         
	}).catch(function (err) {
       console.log(err);
       res.status(400).send(err);
        });
	
};


module.exports = routerMenu;
