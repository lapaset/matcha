import axios from 'axios';
const baseUrl = 'http://localhost:3001/report'

const report = async userObject => {
    const resp = await axios.post(baseUrl, userObject)
    return resp.data;
}

export default { report }