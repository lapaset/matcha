const webSocketServer = require('websocket').server
const db = require('../utils/db')

module.exports = server => {
	const wsServer = new webSocketServer({
		httpServer: server
	})

	const clients = {}

	wsServer.on('request', request => {
		console.log(`${new Date()} received a new connection from origin ${request.origin}`)

		const connection = request.accept(null, request.origin)

		connection.on('message', message => {
			console.log('\nNew message\n')

			if (message.type === 'utf8') {
				const messageArray = JSON.parse(message.utf8Data)

				console.log('message:', messageArray)

				if (messageArray.type === 'connected')
					clients[messageArray.from] = connection

				if (messageArray.type === 'close') {
					clients[messageArray.from].close()
					console.log(`connection ${messageArray.from} closed`)

				}

				if (messageArray.type === 'message') {

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

							else
								console.log(err)
						})
				}

				if (messageArray.type === 'notification') {

					db.query('INSERT INTO notifications (user_id, from_id, notification) VALUES ($1, $2, $3) RETURNING *',
						[messageArray.user_id, messageArray.from_id, messageArray.notification],
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
}