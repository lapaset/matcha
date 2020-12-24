import axios from 'axios';
const baseUrl = 'http://localhost:3001/likes'

const getLikes = async user_id => {
	const resp = await axios.get(`${baseUrl}?from_user_id=${user_id}`)
	return resp.data
}

const getLike = async (from_user_id, to_user_id) => {
	const resp = await axios.get(`${baseUrl}?from_user_id=${from_user_id}&to_user_id=${to_user_id}`)
	return resp.data
}

const getMatches = async user_id => {
	const resp = await axios.get(`${baseUrl}?from_user_id=${user_id}&match=1`)
	return resp.data
}

const likeUnlike = async userObject => {
    const resp = await axios.post(baseUrl, userObject)
    return resp.data;
}

export default { getLikes, getLike, getMatches, likeUnlike }