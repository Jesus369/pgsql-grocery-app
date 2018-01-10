const mustacheExpress = require('mustache-express')
const methodOverride = require('method-override')
const bodyParser = require('body-parser')
const promise = require('bluebird')
const express = require('express')
const app = express()

app.use(bodyParser.urlencoded({extended:true}))
app.use('/public', express.static('public'))
app.use(express.static('script'))
app.engine("mustache", mustacheExpress())
app.use(methodOverride("_method"))
app.set("view engine","mustache")
app.set('views', './views')

var options = {
	promiseLib : promise
}

// CONFIGURING POSTGRESQL
var connectionString = 'postgres://localhost:5432/jayzuss'
const pgp = require('pg-promise')(options)
var db = pgp(connectionString)


// RESTfull ROUTING
app.get('/', (req,res) => {
	res.redirect('stores')
})

// STORES PAGE, DISPLAY ALL STORES
app.get('/stores', (req,res) => {
	db.any('SELECT * FROM stores').then( (storesdata) => {
		res.render('stores', {stores : storesdata})
	})
})

// NAVIGATING TO CREATE A STORE PAGE
app.get('/stores/newstore', (req,res) => {
		res.render('newstore')
})

// CREATE A NEW STORE
app.post('/stores', (req,res) => {
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
})

// GET STORES ID
app.get('/stores/:id', (req,res) => {
	db.any("SELECT * FROM stores WHERE storeid = " + "'" + req.params.id +"'")
	.then( (data) => {
		res.send(data)
	})
})

app.listen(3000, () => {
	console.log("We are live on channel 3000")
})
