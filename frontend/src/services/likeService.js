import axios from 'axios';
const baseUrl = 'http://localhost:3001/likes'

const likeUnlike = async userObject => {
    const resp = await axios.post(baseUrl, userObject)
    return resp.data;
}

export default { likeUnlike }