const pool = require('../utils/db')

const getUsers = () => {
	/*const users = await pool.query('SELECT * FROM users')

	return users*/
	return new Promise((resolve, reject) => {
		pool().query('SELECT * FROM users', (error, results) => {
			if (error)
				reject(error)
			else
				resolve(results.rows)
		})
	})
}

const createUser = body => {
	return new Promise((resolve, reject) => {
		const { name, username, email, password, gender, orientation } = body
		pool().query('INSERT INTO users (name, username, email, password, gender, orientation) \
					VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
			[ name, username, email, password, gender, orientation ], (error, results) => {
				if (error)
					reject(error)
				else
					resolve(results.rows[0])
			})
	})
}

const updateUser = (body, id) => {
	return new Promise((resolve, reject) => {
		const { name, username, email, gender, orientation } = body
		pool().query('UPDATE users \
					SET (name, username, email, gender, orientation) = ($1, $2, $3, $4, $5) \
					WHERE user_id = $6 RETURNING *',
					[ name, username, email, gender, orientation, id ], (error, results) => {
						if (error)
							reject(error)
						else
							resolve(results.rows[0])
					})
	})
}

const deleteUser = id => {
	return new Promise((resolve, reject) => {
		pool().query('DELETE FROM users WHERE user_id = $1', [id], (error, results) => {
			if (error)
				reject(error)
			else
				resolve(`User deleted with id: ${id}`)
		})
	})
}

module.exports = {
	getUsers,
	createUser,
	deleteUser,
	updateUser
}