import axios from 'axios'

const baseUrl = 'http://localhost:3001/login'

const login = async credentials => {

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


	const resp = await axios.post(baseUrl, credentials)
	console.log('response data', resp.data)

	const row = resp.data.rows[0]
	const { first_name, last_name, id, profile_pic, photo_str, orientation, ...user } = row


	if (row.id && row.profile_pic !== undefined && row.photo_str) {

		user.photos = resp.data.rows.map(r => {
			return ({ id: r.id, photoStr: r.photo_str, profilePic: r.profile_pic })
		})
	}
	
	return ({
		...user,
		firstName: first_name,
		lastName: last_name,
		orientation: orientationFromDb(orientation),
		age: row.age.years
	})
}

export default { login }