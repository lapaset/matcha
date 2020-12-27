const express = require('express')
const cors = require('cors')
const app = express()
const config = require('./utils/config')
const middleware = require('./utils/middleware')
const routes = require('./routes')

app.use(express.json({ limit: '10mb', extended: true }))
app.use(express.urlencoded({ limit: '10mb', extended: true }))
app.use(cors())
app.use(middleware.requestLogger)
app.use(middleware.tokenExtractor)
app.enable('trust proxy')

Object.keys(routes).forEach(k => {
	app.use(`/${k}`, routes[k])
})

app.use(middleware.unknownEndpoint)

const server = app.listen(config.PORT, () => {
	console.log(`App running on port ${config.PORT}.`)
})

const wsServer = require('./socket')(server)

