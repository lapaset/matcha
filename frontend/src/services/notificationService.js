import axios from 'axios'
const baseUrl = 'http://localhost:3001/notifications'

const getNotifications = async user_id => {
	const resp = await axios.get(`${baseUrl}?user_id=${user_id}`)
	return resp.data
}

const notify = async notification => {
	const resp = await axios.post(baseUrl, notification)
	return resp.data
}

const markAsRead = async id => {
	const resp = await axios.patch(`${baseUrl}/${id}`)
	return resp.data
}

export default { getNotifications, notify, markAsRead }