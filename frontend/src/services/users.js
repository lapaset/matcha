import axios from 'axios'
const baseUrl = 'http://localhost:3001/users'

const getAll = async () => {
	const resp = await axios.get(baseUrl)
	return resp.data
}

const getUser = async id => {
	const resp = await axios.get(`${baseUrl}/${id}`)
	return resp.data
}

const updateUser = async (userObject, id) => {
	const resp = await axios.put(`${baseUrl}/${id}`, userObject)
	return resp.data
}

export default { getAll, getUser, updateUser }