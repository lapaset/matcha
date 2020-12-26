import axios from 'axios'
import auth from '../utils/auth'
const baseUrl = 'http://localhost:3001/block'
const noAccess = 'http://localhost:3001/block/no-access'

const block = async user_id => {
    const resp = await axios.post(baseUrl, { to_user_id: user_id }, auth.config())
    return resp.data;
}

const blockedUser = async userObject => {
    const resp = await axios.post(noAccess, userObject)
    return resp.data;
}

const blockedList = async id => {
    const resp = await axios.get(`${baseUrl}/${id}`)
    return resp.data;
}

const unblockUser = async id => {
    const resp = await axios.delete(`${baseUrl}/${id}`, auth.config())
    return resp.data;
}

export default { block, blockedUser, blockedList, unblockUser }