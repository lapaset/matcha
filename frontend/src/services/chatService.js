import axios from 'axios'
const baseUrl = 'http://localhost:3001/chat'

const getChatHistory = async id => {
	const resp = await axios.get(`${baseUrl}/${id}`)
	return resp.data
}

const addMessage = async msg => {
	const resp = await axios.post(baseUrl, msg)
	return resp.data
}

export default { getChatHistory, addMessage }