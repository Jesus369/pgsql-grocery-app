const mustacheExpress = require('mustache-express')
const methodOverride = require('method-override')
const bodyParser = require('body-parser')
const express = require('express')
const app = express()

app.use(bodyParser.urlencoded({extended:true}))
app.use('/public', express.static('public'))
app.engine("mustache", mustacheExpress())
app.use(methodOverride("_method"))
app.use(express.static('script'))
app.set("view engine","mustache")
app.set('views', './views')
db = require('./queries')

// RESTfull ROUTING
app.get('/', (req,res) => {
	res.redirect('stores')
})

// STORES PAGE, DISPLAY ALL STORES
app.get('/stores', db.redirectToStores)

// NAVIGATING TO CREATE A STORE PAGE
app.get('/stores/newstore', db.newStore)

// CREATE A NEW STORE
app.post('/stores', db.saveStore)

// SHOW ROUTE
app.get('/stores/:id', db.showStore)

// DELETE ROUTE
app.delete('/stores/:id', (req,res) => {
	var storeid = parseInt(req.params.id)
	db.result('DELETE FROM stores WHERE storeid = $1', storeid)
})


app.listen(3000, () => {
	console.log("We are live on channel 3000")
})
