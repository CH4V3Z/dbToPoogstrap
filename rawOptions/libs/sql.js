
const q = require("q");
// Declaracion para postgress
const Poolpg = require('pg').Pool;
const format = require('pg-format');

// Declaraciones para MSSQL
const mssql = require('mssql')
let mssql_connector;


let _SQL = {};
let SQLType = "pg";
let inited = false
let database = '';
let pool;
_SQL.init = (confi, type = 'pg') => {
    try {
		SQLType = type;
		console.log("Inicializar DB with ", confi)
		if (SQLType = 'pg') {
			pool = new Poolpg(confi);
			inited = true;
			database = confi.database;
		}
		if (SQLType = "mssql") {
			mssql_connector = new mssql.ConnectionPool(confi).connect().catch(ex=>{
				console.log(ex, "MUERTE")
			});
		}

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
                                console.log('0 EN PG result.rowCount #');
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
    } else if (SQLType == "mysql") {

	} else if (SQLType == "mssql"){
		console.log("conectemonos a MSSQL");
		mssql_connector.then(pooll=>{
			pooll.request()
			.input('table', mssql.VarChar, table)
			.query(`
				SELECT  COLUMN_NAME as columna, COLUMN_DEFAULT as predeterminado, IS_NULLABLE,
						DATA_TYPE as datatype, COALESCE(CHARACTER_MAXIMUM_LENGTH,0) maxlength,
						COALESCE(NUMERIC_PRECISION,0) nsize, COALESCE(NUMERIC_SCALE,0) scala,
						 (	SELECT count(*) primario
                    FROM information_schema.key_column_usage AS c LEFT JOIN information_schema.table_constraints AS t ON t.constraint_name = c.constraint_name
                    WHERE constraint_type = 'PRIMARY KEY' and t.table_name = @table and COLUMN_NAME = tc.COLUMN_NAME
                ) primario
				FROM INFORMATION_SCHEMA.COLUMNS tc WHERE table_name = @table;`)
				.then(result=>{
					if (result.rowsAffected != '0') {
						defer.resolve({ type: 'ok', process: 'OK.Query_.', datos: result.recordset.reduce(purify, []) });
					} else {
						console.log('0 EN PG result.rowCount #' + type);
						console.log(sqlstr);
						defer.resolve({ type: 'empty', process: type + '.Query_', datos: [] });
					}
				}).catch(err3=>{
					console.log('catch EN PG ', err3);
					defer.reject({ type: 'error', process: type + '.catch', datos: err3 });
				});
		}).catch(r=>{
			console.log(r, " 🚨 🧨 Error de conexion..");
		})
	}else {
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
