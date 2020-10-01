const express = require('express')
const app = express()
const config = require('./utils/config')
const usersRouter = require('./controllers/users')

app.use(express.json())

app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000')
	res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers')
	next()
})

app.use('/users', usersRouter)

app.listen(config.PORT, () => {
	console.log(`App running on port ${config.PORT}.`)
})