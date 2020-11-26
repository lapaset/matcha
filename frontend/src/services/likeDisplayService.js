import axios from 'axios';
const baseUrlDisplay = 'http://localhost:3001/likeDisplay'

const unlikeDisplay = async userObject => {
    const resp = await axios.post(baseUrlDisplay, userObject)
    return resp.data;
}

export default { unlikeDisplay }