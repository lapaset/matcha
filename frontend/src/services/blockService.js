import axios from 'axios';
const baseUrl = 'http://localhost:3001/block'
const noAccess = 'http://localhost:3001/block/no-access'
const blockList = 'http://localhost:3001/block/blocklist'
const unblock = 'http://localhost:3001/block/unblock'

const block = async userObject => {
    const resp = await axios.post(baseUrl, userObject)
    return resp.data;
}

const blockedUser = async userObject => {
    const resp = await axios.post(noAccess, userObject)
    return resp.data;
}

const blockedList = async userObject => {
    const resp = await axios.post(blockList, userObject)
    return resp.data;
}

const unblockUser = async userObject => {
    const resp = await axios.post(unblock, userObject)
    return resp.data;
}

export default { block, blockedUser, blockedList, unblockUser }