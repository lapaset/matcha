const express = require('express')
const cors = require('cors')
const app = express()
const config = require('./utils/config')
const middleware = require('./utils/middleware')
const routes = require('./routes')
const webSocketServer = require('websocket').server
const db = require('./utils/db')

app.use(express.json({ limit: '10mb', extended: true }))
app.use(express.urlencoded({ limit: '10mb', extended: true }))
app.use(cors())
app.use(middleware.requestLogger)
app.enable('trust proxy')

Object.keys(routes).forEach(k => {
	app.use(`/${k}`, routes[k])
})

app.use(middleware.unknownEndpoint)

const server = app.listen(config.PORT, () => {
	console.log(`App running on port ${config.PORT}.`)
})

const wsServer = new webSocketServer({
	httpServer: server
})

const clients = {}

wsServer.on('request', request => {
	//const userId = uuidv4()
	console.log(`${new Date()} received a new connection from origin ${request.origin}`)
	//console.log('request', request)

	const connection = request.accept(null, request.origin)

	console.log(`connected`)

	connection.on('message', message => {

		console.log('its a message', message)
		/*if (message.type === 'utf8') {
			console.log(`received message: ${message.utf8Data}`)

			for (key in clients) {
				clients[key].sendUTF(message.utf8Data)
				console.log('sent message to: ', key)
			}
		}*/

		if (message.type === 'utf8') {
			const messageArray = JSON.parse(message.utf8Data)
			console.log(`received message type: ${messageArray.type}`)

			if (messageArray.type === 'connected')
				clients[messageArray.from] = connection

			if (messageArray.type === 'close') {
				clients[messageArray.from].close()
				console.log(`connection ${messageArray.from} closed`)

			}

			if (messageArray.type === 'message') {

				console.log('message to:', messageArray.to, 'from: ', messageArray.from)
				db.query(`INSERT INTO chat (sender, receiver, msg) VALUES($1, $2, $3) RETURNING *`,
					[messageArray.from, messageArray.to, messageArray.msg], (err, res) => {

						if (res && res.rows[0]) {

							if (clients[messageArray.to] && clients[messageArray.to].connected) {

								clients[messageArray.to].sendUTF(JSON.stringify({ ...res.rows[0], type: 'message' }))
								clients[messageArray.from].sendUTF(JSON.stringify({ ...res.rows[0], type: 'message' }))
							}

							else
								clients[messageArray.from].sendUTF(JSON.stringify({ ...res.rows[0], type: 'rejected' }))
						}

						else {

							console.log(err)
						}
					})
			}

			if (messageArray.type === 'notification') {

				db.query('INSERT INTO notifications (user_id, notification) VALUES ($1, $2) RETURNING *',
					[messageArray.user_id, messageArray.notification],
					(err, res) => {
						if (res && res.rows[0]) {
							if (clients[messageArray.user_id] && clients[messageArray.user_id].connected)
								clients[messageArray.user_id].sendUTF(JSON.stringify({ ...res.rows[0], type: 'notification' }))
						}
						else
							console.log(err)
					})

			}
		}
	})

	connection.on('close', () => {
		console.log((new Date()) + " Peer disconnected.");
		//	delete clients[userId];
	})
})
