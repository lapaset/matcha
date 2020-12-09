import { w3cwebsocket as W3CWebSocket } from 'websocket'

const createWs = (from) => {
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

export default { createWs }