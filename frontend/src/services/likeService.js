import axios from 'axios';
const baseUrl = 'http://localhost:3001/likes'

const getLikes = async id => {
	const resp = await axios.get(`${baseUrl}?from_user_id=${id}`)
	return resp.data
}

const getMatches = async id => {
	const resp = await axios.get(`${baseUrl}?from_user_id=${id}&match=1`)
	return resp.data
}

const likeUnlike = async userObject => {
    const resp = await axios.post(baseUrl, userObject)
    return resp.data;
}

export default { getLikes, getMatches, likeUnlike }