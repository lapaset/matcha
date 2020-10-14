const e = require('express')
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
				reject({ error: 'User not found' })
			else
				reject({ error: err.details })
		})
	})
}

const createUser = body => {
	return new Promise((resolve, reject) => {
		const { firstName, lastName, username, email, password, gender, orientation } = body
		db.query('INSERT INTO users (first_name, last_name, username, email, password, gender, orientation) \
					VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
			[firstName, lastName, username, email, password, gender, orientation], (err, res) => {
				if (err)
					reject(err)
				else
					resolve(res.rows[0])
			})
	})
}

const updateUser = (body, id) => {
	return new Promise((resolve, reject) => {
		const { firstName, lastName, username, email, gender, orientation, tags, bio } = body
		db.query('UPDATE users \
					SET (first_name, last_name, username, email, gender, orientation, tags, bio) = ($1, $2, $3, $4, $5, $6, $7, $8) \
					WHERE user_id = $9 RETURNING *',
			[firstName, lastName, username, email, gender, orientation, tags, bio, id], (err, res) => {
				
				if (res && res.rows[0])
					resolve(res.rows[0])
				else if (res)
					reject({ error: 'User not found' })
				else 
					reject({ error: err.detail })
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