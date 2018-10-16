const fs = require('fs');
let sql = require('./libs/sql');
let boots = require('./libs/makebootstrap');
let confi = {
    pg: {
        "user": "postgres",
        "password": "??",
        "host": "localhost",
        "database": "bigtrack",
        "max": 10,
        "min": 2,
        "port": 5433,
        // "idleTimeoutMillis": 5000
    },
    mysql:{

    }
}
let args = process.argv.slice(2);
let host, password,tabla
let SQLType = "pg";
let translate = "_tran_";
let port = null;
let database = null;
let generarHtml;
// Evaluacion de Parametros
args.forEach(element => {
    switch (element.split(':')[0].toLowerCase()) {
        case '-p':
            password = element.substr(element.indexOf(':') + 1).trim();
            console.log("Password Is: ", password);
            break;
        case '-h':
            host = element.substr(element.indexOf(':') + 1).trim();
            console.log("Host Is: ", host);
            break;
        case '-t':
            tabla = element.substr(element.indexOf(':') + 1).trim();
            console.log("Table Name Is: ", tabla);
            break;
        case '-s':
            SQLType = element.substr(element.indexOf(':') + 1).trim();
            console.log("SQLType Is: ", SQLType);
            break;
        case '-port':
            port = element.substr(element.indexOf(':') + 1).trim();
            console.log("Port Is: ", port);
            break;
        case '-db':
            database = element.substr(element.indexOf(':') + 1).trim();
            console.log("Database Is: ", database);
            break;
        case '-i18':
            translate = element.substr(element.indexOf(':') + 1).trim();
            console.log("Translate Is: ", translate);
            break;
        default:
            console.log("Undefined Parameter in argument =>", element );
            break;
    }
});
let paso = true;

// PARAMETROS OBLIGATORIOS
if (!password || password.length == 0) {
    console.error("Parametro password(-p) Invalido");
    paso = false;
}
if (!host || host.length == 0) {
    console.log("Parametro Host (-h) Invalido");
    paso = false;
}
if (!tabla || tabla.length == 0) {
    console.log("Parametro Tabla (-t) Invalido");
    paso = false;
}
if (paso) {
    if (SQLType == 'pg') {
        confi.pg.password   = password;
        confi.pg.host       = host;
        port && (confi.pg.port = port);
        database && (confi.pg.database = database);

        sql.init(confi.pg, 'pg');

        sql.getTableStruct(tabla)
        .then(res=>generarHtml(res))
        .fail(console.error)

    } else if (SQLType == 'mysql') {
        
    }else{
        console.log("Tipo de Base de Datos no es valido...");
    }
}
generarHtml = (datos) =>{
    if (datos && datos.hasOwnProperty('type') && datos.type == 'ok') {
        console.log("+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=    Resultados    +=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=");
        let html = boots.make(datos.datos,translate);
        fs.writeFile("./outs/"+tabla + ".pug", html, (err)=>{
            if (err) {
                return console.log(err);
            }
            console.log("The file was saved!");
        }); 
    }else{
        console.log(datos);
    }
}


return;