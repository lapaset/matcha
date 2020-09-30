require('dotenv').config()
const express = require('express')
const app = express()

const user_model = require('./models/user')


app.use(express.json())
app.use(function (req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000')
	res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers')
	next()
})

app.get('/', (req, res) => {
	user_model.getUsers()
		.then(r => {
			res.status(200).send(r)
		})
		.catch(e => {
			res.status(500).send(e)
		})
})

app.post('/users', (req, res) => {
	user_model.createUser(req.body)
		.then(r => {
			res.status(200).send(r)
		})
		.catch(e => {
			res.status(500).send(e)
		})
})

app.put('/users/:id', (req, res) => {
	user_model.updateUser(req.body, req.params.id)
		.then(r => {
			res.status(200).send(r)
		})
		.catch(e => {
			res.status(500).send(e)
		})
})

app.delete('/users/:id', (req, res) => {
	user_model.deleteUser(req.params.id)
		.then(r => {
			res.status(200).send(r)
		})
		.catch(e => {
			res.status(500).send(e)
		})
})

const PORT = process.env.PORT
app.listen(PORT, () => {
	console.log(`App running on port ${PORT}.`)
})