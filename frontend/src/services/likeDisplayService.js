import axios from 'axios';
const baseUrlDisplay = 'http://localhost:3001/likeDisplay'

const likeDisplay = async userObject => {
    const resp = await axios.get(baseUrlDisplay, userObject)
    return resp.data;
}

export default { likeDisplay }