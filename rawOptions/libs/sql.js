
const q = require("q");
const Poolpg = require('pg').Pool;
const format = require('pg-format');
let _SQL = {};
let SQLType = "pg";
let inited = false
let database = '';
let pool;
_SQL.init = (confi, type = 'pg') => {
    try {
        console.log("Inicializar DB with ", confi)
        SQLType = type;
        pool = new Poolpg(confi);
        inited = true;
        database = confi.database;

    } catch (error) {
        inited = false;
        console.error(error);
    }
};


_SQL.getTableStruct = (table) => {
    let defer = q.defer();
    let qrty;
    if (SQLType == 'pg') {
        sqlstr = `
            SELECT 
                "column_name" columna, ordinal_position orden, split_part(column_default, '::', 1) predeterminado, udt_name datatype,
                COALESCE(character_maximum_length, 0) maxlength, numeric_precision nsize, numeric_scale scala,
                (	SELECT count(*) primario 
                    FROM information_schema.key_column_usage AS c LEFT JOIN information_schema.table_constraints AS t ON t.constraint_name = c.constraint_name 
                    WHERE constraint_type = 'PRIMARY KEY' and t.table_name = '${table}' and "column_name" = tc.column_name
                ) primario
            FROM information_schema.columns tc
            WHERE table_catalog = '${database}' and table_schema = 'public' AND "table_name" = '${table}' 
            ORDER BY ordinal_position ASC ;
        `;
        pool.connect((err1, client, release) => {
            release();
            if (err1) {
                console.log("No fue posible conectar a la Base de Datos. Informe Inmediatamente el codigo: #");
                defer.reject({ msg: "No fue posible conectar a la Base de Datos", error: err1, type: 'error' });
            } else {
                qrty = client.query(sqlstr, (err, result)=>{
                    try {
                        if (err) {
                            console.log(sqlstr);
                            console.log('err EN PG#5    type+#', err);
                            defer.reject({ type: 'error', process: type + '.Query_', datos: err });
                        } else {
                            let res = {};
                            if (result.rowCount != '0') {
                                defer.resolve({ type: 'ok', process: '.Query_.', datos: result.rows.reduce(purify, []) });
                            } else {
                                console.log('0 EN PG result.rowCount #' + type);
                                console.log(sqlstr);
                                defer.resolve({ type: 'empty', process: type + '.Query_', datos: [] });
                            }
                        }
                    } catch (err3) {
                        console.log('catch EN PG ', err3);
                        defer.reject({ type: 'error', process: type + '.catch', datos: err3 });
                    }
                });
            }
        });
    } else if (SQLType = "mysql") {

    } else {
        process.nextTick(() => {
            defer.reject({ msg: "Tipo de Bases de Datos no es valido!", error: err1, type: 'error' }); 
        });
    }
    return defer.promise;
};
let purify = (old, new_, inx, rw) => {
    old[inx] = JSON.parse(JSON.stringify(new_));
    return old;
};
module.exports = _SQL;