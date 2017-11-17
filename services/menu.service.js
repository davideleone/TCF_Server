var _ = require('lodash');
var Q = require('q');


var serviceMenu = {};

const Menu = require('../models/menu.js');

serviceMenu.getAll = getAll;

module.exports = serviceMenu;

//TODO gestire visualizzazione per profilo
function getAll(userLogged) {
    console.log("getAll");
    var deferred = Q.defer();

    Menu.find({}, null, { sort: {ord_vis : 1} }, function (err, menuEntries) {
      if (err){
        deferred.reject(err.name + ': ' + err.message);  
      } else{
        deferred.resolve(menuEntries);
      }
      console.log(menuEntries);
    });
    
    return deferred.promise;
}