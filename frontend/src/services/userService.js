import axios from 'axios'
const baseUrl = 'http://localhost:3001/users'

const orientationFromDb = orientation => {
	const o = []

	if (!orientation)
		return o
	if (orientation.includes('f'))
		o.push('female')
	if (orientation.includes('m'))
		o.push('male')
	if (orientation.includes('o'))
		o.push('other')
	return o
}

const getAll = async () => {
	const resp = await axios.get(baseUrl)

	return resp.data.map(u => ({
		...u,
		orientation: orientationFromDb(u.orientation)
	}))
}

const getUser = async userId => {
	const resp = await axios.get(`${baseUrl}/${userId}`)

	const { first_name, last_name, id, profile_pic, photo_str, orientation, ...user } = resp.data[0]

	if (resp.data[0].id && resp.data[0].profile_pic && resp.data[0].photo_str) {

		user.photos = resp.data.map(r => {
			return ({ id: r.id, photoStr: r.photo_str, profilePic: r.profile_pic })
		})
	}

	return ({
		...user,
		firstName: first_name,
		lastName: last_name,
		orientation: orientationFromDb(orientation),
		age: resp.data[0].age.years
	})
}

const updateUser = async (userObject, id) => {
	const resp = await axios.put(`${baseUrl}/${id}`, userObject)

	const { first_name, last_name, orientation, ...user } = resp.data

	return ({
		...user,
		firstName: first_name,
		lastName: last_name,
		orientation: orientationFromDb(orientation),
		age: resp.data.age.years
	})
}

const createUser = async userObject => {
	const resp = await axios.post(baseUrl, userObject)
	return resp.data
}

const getByGenderOrientation = async () => {
	const resp = await axios.get(`baseUrl`)
	return resp.data
}

export default { getAll, getUser, updateUser, createUser, getByGenderOrientation }