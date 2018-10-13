'use strict'

global._app = {
	sql: __dirname + '/libs/sql',
	// io: __dirname + '/libs/io',
	// imgs: __dirname + '/private/imgs',
};

const express 		= require('express')
const bodyParser 	= require('body-parser')
const http 			= require('http')
const app = express();
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});
app.use(bodyParser.urlencoded({limit:'50mb', extended: false}))
app.use(bodyParser.json({limit:'50mb'}))
app.use('/', 	require('./routes/routes'));//<-carga dinamicamente todas las rutas de los plugins

let server = http.createServer(app);

server.listen(3005, () => console.log('Express running on port 3005'));
console.log("***Todo Cargado****");