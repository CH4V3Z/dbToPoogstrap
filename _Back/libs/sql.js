"use strict"
// PostgreSql DB imports
const Poolpg = require('pg').Pool;
const format = require('pg-format');

// Mysql DB imports
const mysql = require('mysql')


const q = require("q");

const _SQL = require('./index');

let run = require('./common')
let confi = require('../configs.js')
let pool = new Poolpg(confi.pg);
let sql = {};

sql.pool = pool;