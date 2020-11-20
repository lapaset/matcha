import axios from 'axios';
const baseUrl = 'http://localhost:3001/likes'

const likeUnlike = async email => {
    const resp = await axios.post(baseUrl, email)
    return resp.data;
}

export default { likeUnlike }