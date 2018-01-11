// CONFIGURING POSTGRESQL
var connectionString = 'postgres://localhost:5432/jayzuss'
const pgp = require('pg-promise')(options)
const promise = require('bluebird')
var db = pgp(connectionString)

var options = {
	promiseLib : promise
}

// TAKE ME TO STORE'S PAGE
function redirectToStores(req, res, next) {
		db.any('SELECT * FROM stores').then( (storesdata) => {
		res.render('stores', {stores : storesdata})
	})
}

// TAKE ME TO NEWSTORE'S PAGE
function newStore(req,res,next) {
	res.render('newstore')
}

// SAVE THE STORE
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

// SHOW THE STORE IN IT'S OWN PAGE
function showStore (req,res,next) {
	db.any("SELECT * FROM stores WHERE storeid = " + "'" + req.params.id +"'", req.body)
	.then( (data) => {
		res.render('showstore', {data : data})
	})
}

function deleteStore (req,res,next) {
	var storeid = parseInt(req.params.id)
	db.result('DELETE FROM stores WHERE storeid = '+ "'" + storeid + "'")
	res.redirect('/stores')
}

// EXPORT IT!
module.exports = {
	redirectToStores,
	newStore,
	saveStore,
	showStore,
	deleteStore
	}
