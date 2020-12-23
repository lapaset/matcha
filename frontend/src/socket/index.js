import { w3cwebsocket as W3CWebSocket } from 'websocket'

const createWs = from => {
	const client = new W3CWebSocket('ws://127.0.0.1:3001')

	client.onerror = () => {
		console.log('Websocket connection error')
	}

	client.onopen = () => {

		console.log('Websocket client connected')
		client.send(JSON.stringify({
			type: "connected",
			from
		}))
	}

	client.onclose = () => {
		console.log('Websocket connection closed')
	}
	
	return client
}

const sendNotification = (wsClient, notification) => {

	//show some kind of error if connection is not working
	if (wsClient.current.readyState > 1) {
		console.log('Error: could not send notification, websocket state', wsClient.current.readyState)
		return
	}

	wsClient.current.send(JSON.stringify({
		...notification,
		type: 'notification'
	}))

}

export default { createWs, sendNotification }