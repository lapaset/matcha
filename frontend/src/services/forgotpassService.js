import axios from 'axios';
const baseUrl = 'http://localhost:3001/reset'

const forgotPass = async email => {
    const resp = await axios.post(baseUrl, email)
    return resp.data;
}

export default { forgotPass }