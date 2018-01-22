require('rootpath')();

var express = require('express');
var mongoose = require('mongoose');
var cors = require('cors');
var bodyParser = require('body-parser');
var expressJwt = require('express-jwt');
var config = require('config.json')[process.env.NODE_ENV || 'dev'];
var RouterFactory = require('node-express-crud-router').RouterFactory;
var JL = require('jsnlog').JL;
var winston = require('winston');
var jsnlog_nodejs = require('jsnlog-nodejs').jsnlog_nodejs;


if(process.env.NODE_ENV=='custom'){
	config.connectionString=process.env.MONGODB_HOST;
	config.port = process.env.PORT;
	config.secret = process.env.SECRET;
	config.apiUrl = process.env.APIURL;
}

mongoose.connect(config.connectionString);

//LOGGING CONFIGURATION - START
var JL = require('jsnlog').JL;
var winston = require('winston');
var jsnlog_nodejs = require('jsnlog-nodejs').jsnlog_nodejs;

//DATABASE CONNECT
require('winston-mongodb').MongoDB;
var mongo_appender = new winston.transports.MongoDB( { db: config.connectionString, collection: 'log', level: 'info' });
var consoleAppender = JL.createConsoleAppender('consoleAppender');
JL().setOptions({ "appenders": [mongo_appender, consoleAppender] });

//INIT AND STARTING APPLICATION
var app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/tcf/api/jsnlog.logger', function (req, res) { 
  jsnlog_nodejs(JL, req.body);
  res.send(''); 
});


//DYNAMIC STANDARD CRUD ROUTES
app.use('/tcf/api/domainController/CRUD',           RouterFactory.create({path: "", model: require('./models/domain.js')}));
app.use('/tcf/api/userController/CRUD',             RouterFactory.create({path: "", model: require('./models/user.js')}));
app.use('/tcf/api/attivitaController/CRUD',         RouterFactory.create({path: "", model: require('./models/attivita.js')}));
app.use('/tcf/api/consuntivoController/CRUD',       RouterFactory.create({path: "", model: require('./models/consuntivo.js')}));
app.use('/tcf/api/meseConsuntivoController/CRUD',   RouterFactory.create({path: "", model: require('./models/meseConsuntivo.js')}));
app.use('/tcf/api/clienteController/CRUD',          RouterFactory.create({path: "", model: require('./models/cliente.js')}));
app.use('/tcf/api/commessaClienteController/CRUD',  RouterFactory.create({path: "", model: require('./models/commessaCliente.js')}));
app.use('/tcf/api/commessaFinconsController/CRUD',  RouterFactory.create({path: "", model: require('./models/commessaFincons.js')}));
app.use('/tcf/api/menuController/CRUD',             RouterFactory.create({path: "", model: require('./models/menu.js')}));

//STATIC CUSTOM ROUTES
app.use('/tcf/api/userController', require('./controllers/user.controller'));
app.use('/tcf/api/domainController', require('./controllers/domain.controller'));
app.use('/tcf/api/consuntivoController', require('./controllers/consuntivo.controller'));
app.use('/tcf/api/reportisticaController', require('./controllers/reportistica.controller'));
app.use('/tcf/api/menuController', require('./controllers/menu.controller'));
app.use('/tcf/api/meseConsuntivoController', require('./controllers/meseConsuntivo.controller'));
app.use('/tcf/api/clienteController', require('./controllers/cliente.controller'));
app.use('/tcf/api/attivitaController', require('./controllers/attivita.controller'));
app.use('/tcf/api/commessaClienteController', require('./controllers/commessaCliente.controller'));
app.use('/tcf/api/commessaFinconsController', require('./controllers/commessaFincons.controller'));
 
// start server
var port = config.port;
var server = app.listen(port, function () {
    JL().info('Fincons Time Control API started on port: ' + port);
});


//SERVE??
/* rollback transaction appese
const Fawn = require("fawn");
var roller = Fawn.Roller();

roller.roll()
 .then(function(){
   // start server
 });*/



// use JWT auth to secure the api, the token can be passed in the authorization header or querystring
// app.use(expressJwt({
//     secret: config.secret,
//     getToken: function (req) {
//         if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
//             return req.headers.authorization.split(' ')[1];
//         } else if (req.query && req.query.token) {
//             return req.query.token;
//         }
//         return null;
//     }
// }).unless({ path: ['/tcf/api/userController/authenticate'] }));