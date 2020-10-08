const db = require('../utils/db')

const getUsers = () => {
	return new Promise((resolve, reject) => {
		db.query('SELECT * FROM users', [], (err, res) => {
			if (err)
				reject(err)
			else
				resolve(res.rows)
		})
	})
}

const getUser = id => {
	return new Promise((resolve, reject) => {
		db.query('SELECT * FROM users WHERE user_id = $1', [id], (err, res) => {
			if (res && res.rows[0])
				resolve(res.rows[0])
			else if (res)
				reject(`User not found`)
			else
				reject(err)
		})
	})
}

const createUser = body => {
	return new Promise((resolve, reject) => {
		const { name, username, email, password, gender, orientation } = body
		db.query('INSERT INTO users (name, username, email, password, gender, orientation) \
					VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
			[name, username, email, password, gender, orientation], (err, res) => {
				if (err)
					reject(err)
				else
					resolve(res.rows[0])
			})
	})
}

const updateUser = (body, id) => {
	return new Promise((resolve, reject) => {
		const { name, username, email, gender, orientation, tags } = body
		db.query('UPDATE users \
					SET (name, username, email, gender, orientation, tags) = ($1, $2, $3, $4, $5, $6) \
					WHERE user_id = $7 RETURNING *',
			[name, username, email, gender, orientation, tags, id], (err, res) => {
				if (res && res.rows[0])
					resolve(res.rows[0])
				else if (res)
					reject(`User not found`)
				else {
					console.log('error', err.detail)
					reject(err)
				}
			})
	})
}

const deleteUser = id => {
	return new Promise((resolve, reject) => {
		db.query('DELETE FROM users WHERE user_id = $1', [id], (err, res) => {
			if (res && res.rows[0])
				resolve(`User deleted with id ${id}`)
			else if (res)
				reject(`User not found`)
			else {
				console.log('error', err.detail)
				reject(err)
			}
		})
	})
}

module.exports = {
	getUsers,
	getUser,
	createUser,
	deleteUser,
	updateUser
}