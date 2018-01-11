const promise = require('bluebird')

var options = {
	promiseLib : promise
}

// CONFIGURING POSTGRESQL
var connectionString = 'postgres://localhost:5432/jayzuss'
const pgp = require('pg-promise')(options)
var db = pgp(connectionString)


function redirectToStores(req, res, next) {
		db.any('SELECT * FROM stores').then( (storesdata) => {
		res.render('stores', {stores : storesdata})
	})
}

function newStore(req,res,next) {
	res.render('newstore')
}

function saveStore(req,res,next) {
	let storename = req.body.storename
	let addressone = req.body.addressone
	let addresstwo = req.body.addresstwo
	let city = req.body.city
	let state = req.body.state
	let zip = parseInt(req.body.zip)

	db.none('INSERT INTO stores(name,addressone,addresstwo,city,state,zip)' + 
	'values(${storename},${addressone},${addresstwo},${city},${state},${zip})',req.body)

	db.any('SELECT * from stores').then( (storesdata) => {
		res.redirect('/stores')
	})
}

function showStore (req,res,next) {
	db.any("SELECT * FROM stores WHERE storeid = " + "'" + req.params.id +"'")
	.then( (data) => {
		res.render('showstore', {data : data})
	})
}

module.exports = {
	redirectToStores,
	newStore,
	saveStore,
	showStore}
