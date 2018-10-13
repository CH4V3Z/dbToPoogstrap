"use strict"
const express 	= require('express');
const r 		= express.Router();
const q 		= require('q')

// PostgreSql DB imports
const { Pool, Client } = require('pg');

const format = require('pg-format');

// Mysql DB imports
const mysql = require('mysql')

// const _SQL		= require('../libs/sql');
// const R 		= require('ramda');
// const run 		= require('../common.js');
// const path 		= require('path');
// const fs 		= require('fs');
let clienteConfigPG = {
	user: '',
	host: '',
	database: '',
	password: '',
	port: ''
  }
let sql=""


r.post('/connect',(req,res,next)=>{next()}, (req, res, next) => {
	let defer = q.defer()
	if(req.body.tipodb=="MySql"){

	}
	else if(req.body.tipodb == 'PostgreSql'){
		clienteConfigPG.user = req.body.usr
		clienteConfigPG.host = req.body.ip 
		clienteConfigPG.database = req.body.db
		clienteConfigPG.password = req.body.pwd
		clienteConfigPG.port = req.body.puerto
		const clientPg = new Client(clienteConfigPG)
		try{
			clientPg.connect()
					.then(()=>	{
						console.log("Conectado")
						defer.resolve({ type: 'ok', process: '.Connect.'})
						res.status(200).send({type:'Ok'})	
						clientPg.end()			

					})
					.catch((e) => {
						console.error('connection error')
						defer.reject({type: 'Fail', process: '.Connect.'})
						res.status(200).send({type:'Fail'})		
						clientPg.end()			

							}
					)
		}catch(ex){
			defer.reject({type: 'Fail', process: '.Connect.'})								
			console.log("Error al conectar con postgresql:",ex.message)
		}finally{
			return defer.promise
		}	
	}
});

r.post('/gettables',(req,res,next)=>{next()}, (req, resp, next) => {
	let defer = q.defer()
	sql="SELECT table_name FROM information_schema.tables where table_catalog=$1 and table_schema = 'public' and table_type = 'BASE TABLE'"
	// res.status(200).send({type:'Ok'})						
	
	const clientPg = new Client(clienteConfigPG) 
	clientPg.connect()
	
	clientPg.query(
		sql, ['eagledb'], (err, res) => {
		
		// console.log(err ? err.stack : res.rows) // Hello World!
		defer.resolve({ type: 'ok', process: '.gettables.'})
		resp.status(200).send({type:'Ok', data:res})
		clientPg.end()
		
	})
	console.log("ruta de gettables")

});

r.post('/getviews',(req,res,next)=>{next()}, (req, resp, next) => {
	let defer = q.defer()
	sql="SELECT table_name FROM information_schema.views where table_catalog=$1 and table_schema = 'public'"
	// res.status(200).send({type:'Ok'})						
	
	const clientPg = new Client(clienteConfigPG) 
	clientPg.connect()
	
	clientPg.query(
		sql, ['eagledb'], (err, res) => {
		
		// console.log(err ? err.stack : res.rows) // Hello World!
		defer.resolve({ type: 'ok', process: '.getviews.'})
		resp.status(200).send({type:'Ok', data:res})
		clientPg.end()
		
	})
	console.log("ruta de getviews")

});

r.post('/getfields1',(req,res,next)=>{next()}, (req, resp, next) => {
	// let defer = q.defer()
	// sql="SELECT table_name FROM information_schema.views where table_catalog=$1 and table_schema = 'public'"
	sql="SELECT * FROM information_schema.columns WHERE table_catalog = '"+req.body.db+"' AND table_schema = 'public' AND table_name   = '"+req.body.tabla+"'"	
	// res.status(200).send({type:'Ok'})						
	// console.log("getfields:",sql," || ", req.body)
	// console.log('Req:',req)	
	const clientPg = new Client(clienteConfigPG) 
	clientPg.connect()
	
	clientPg.query(
		sql, [req.body.db,req.body.tabla], (err, res) => {
		// console.log("getfields:",sql," || ", req.body)		
		// console.log(err ? err.stack : res.rows) // Hello World!
		// defer.resolve({ type: 'ok', process: '.getviews.'})
		console.log('Data:',res)
		resp.status(200).send({type:'Ok', data:res})
		clientPg.end()
		
	})
	console.log("ruta de getfields")

});

r.post('/getfields',(req,res,next)=>{next()}, (req, resp, next) => {
	let defer = q.defer()
	
	sql="SELECT * FROM information_schema.columns WHERE table_catalog = '"+req.body.bd+"' AND table_schema = 'public' AND table_name   = '"+req.body.tabla+"'"
	console.log("getfields:",sql," || ", req.body)
	// res.status(200).send({type:'Ok'})						
	
	const clientPg = new Client(clienteConfigPG) 
	clientPg.connect()
	
	clientPg.query(
		sql, ['eagledb'], (err, res) => {
			console.log('res:',res)
			if(err)
			{
				defer.resolve({ type: 'fail', process: '.getviews.'})
				resp.status(200).send({type:'fail', data:err})
			}
		// console.log(err ? err.stack : res.rows) // Hello World!
		defer.resolve({ type: 'ok', process: '.getviews.'})
		resp.status(200).send({type:'Ok', data:res})
		clientPg.end()
		
	})

});
module.exports = r;