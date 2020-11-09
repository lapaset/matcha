import axios from 'axios'
const baseUrl = 'http://localhost:3001/users'
const mapUrl = 'http://localhost:3001/users/map'

const responseDataToApp = data => {
	const { first_name, last_name, ...user } = data
  
	return ({
		...user,
		firstName: data.first_name,
		lastName: data.last_name
	})
}

const getAll = async () => {
	const resp = await axios.get(baseUrl)
	return resp.data
}

const getUser = async id => {
	const resp = await axios.get(`${baseUrl}/${id}`)
	return responseDataToApp(resp.data)
}

const updateUser = async (userObject, id) => {
	const resp = await axios.put(`${baseUrl}/${id}`, userObject)
  
	return responseDataToApp(resp.data)
}

const createUser = async userObject => {
	const resp = await axios.post(baseUrl, userObject)
	return resp.data
}

const updateMap = async (userData) => {
	const resp = await axios.put(mapUrl, userData)
	return resp.data
}

export default { getAll, getUser, updateUser, createUser, updateMap }