const Pool = require('pg').Pool

const pool = new Pool({
	user: process.env.PG_USER,
	host: process.env.PG_HOST,
	database: process.env.PG_DB,
	password: process.env.PG_PW,
	port: process.env.PG_PORT,
})

const getUsers = () => {
	return new Promise((resolve, reject) => {
		pool.query('SELECT * FROM users', (error, results) => {
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
		pool.query('INSERT INTO users (name, username, email, password, gender, orientation) \
								VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
								[ name, username, email, password, gender, orientation ], (error, results) => {
									if (error)
										reject(error)
									else
										resolve(results.rows[0])
								})
	})
}

const deleteUser = id => {
	return new Promise((resolve, reject) => {
		pool.query('DELETE FROM users WHERE user_id = $1', [id], (error, results) => {
			if (error)
				reject(error)
			else
				resolve(`Merchant deleted with id: ${id}`)
		})
	})
}

module.exports = {
	getUsers,
	createUser,
	deleteUser
}