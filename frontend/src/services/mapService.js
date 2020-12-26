import axios from 'axios'
import auth from '../utils/auth'

const updateMap = async (userObject, id) => {
	const resp = await axios
		.patch(`http://localhost:3001/users/${id}`, userObject, auth.config())

	return resp.data
}

export default { updateMap }
