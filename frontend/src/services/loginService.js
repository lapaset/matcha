import axios from 'axios'
import userService from './userService'
const baseUrl = 'http://localhost:3001/login'

const login = async credentials => {
	const resp = await axios.post(baseUrl, credentials)
  
	return userService.responseDataToApp(resp.data)
}

export default { login }