const mustacheExpress = require('mustache-express')
const methodOverride = require('method-override')
const bodyParser = require('body-parser')
const promise = require('bluebird')
const express = require('express')
const app = express()

app.use(bodyParser.urlencoded({extended:true}))
app.use('/public', express.static('public'))
app.engine("mustache", mustacheExpress())
app.use(methodOverride("_method"))
app.set("view engine","mustache")
app.set('views', './views')

// CONFIGURING POSTGRESQL
var connectionString = 'postgres://localhost:5432/jayzuss'
const pgp = require('pg-promise')(options)
var db = pgp(connectionString)

var options = {
	promiseLib : promise
}

app.get('/', (req,res) => {
	res.redirect('stores')
})

app.get('/stores', (req,res) => {
	db.any('SELECT * FROM stores').then( (err,storesdata) => {
		res.render('stores', {"stores" : storesdata})
	})
})

app.get('/stores/newstore', (req,res) => {
		res.render('newstore')
})

app.post('/stores', (req,res) => {
	let store = req.body.store
	let addressone = req.body.addressone
	let addresstwo = req.body.addresstwo
	let city = req.body.city
	let state = req.body.state
	let zip = req.body.zip

	db.none('INSERT INTO stores(name,addressone,addresstwo,city,state,zip) values($1,$2,$3,$4,$5,$6)',[store,addressone,addresstwo,city,state,zip])
	db.any('SELECT * from stores').then( (err,storesdata) => {
		if(err) {
			res.send('AN ERROR HAS OCCURED POSTING')
		} else {
			res.render('stores', {'stores' : storesdata})
		}
	})
})

app.listen(3000, () => {
	console.log("We are live on channel 3000")
})