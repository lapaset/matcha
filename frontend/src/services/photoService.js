import axios from 'axios'
const baseUrl = 'http://localhost:3001/photos'

const addPhoto = async photo => {
	const resp = await axios.post(baseUrl, photo)
	return resp.data
}

export default { addPhoto }