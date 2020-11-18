import axios from 'axios';
const baseUrl = 'http://localhost:3001/map'

const updateMap = async (userObject) => {
    const resp = axios.put(baseUrl, userObject)
    return resp.data;
}

export default { updateMap }
