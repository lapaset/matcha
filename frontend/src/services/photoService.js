import axios from 'axios'
const baseUrl = 'http://localhost:3001/photos'

const addPhotos = async photos => {
	const resp = await axios.post(baseUrl, photos)
	return resp.data
}

export default { addPhotos }