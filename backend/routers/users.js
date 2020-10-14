const usersRouter = require('express').Router()
const db = require('../utils/db')

usersRouter.get('/', (req, resp) => {
	db.query('SELECT * FROM users', [], (err, res) => {
		if (err)
			resp.status(500).send(err)
		else
			resp.status(200).send(res.rows)
	})
})

usersRouter.get('/:id', (req, resp) => {
	db.query('SELECT * FROM users WHERE user_id = $1', [req.params.id], (err, res) => {
		if (res && res.rows[0])
			resp.status(200).send(res.rows[0])
		else if (res)
			resp.status(500).send({ error: 'User not found' })
		else
			resp.status(500).send({ error: err.detail })
	})
})

usersRouter.post('/', (req, resp) => {
	const { firstName, lastName, username, email, password, gender, orientation } = req.body
	db.query('INSERT INTO users (first_name, last_name, username, email, password, gender, orientation) \
				VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
		[firstName, lastName, username, email, password, gender, orientation], (err, res) => {
			if (err)
				resp.status(500).send(err)
			else
				resp.status(200).send(res.rows[0])
		})
})

usersRouter.put('/:id', (req, resp) => {
	const { firstName, lastName, username, email, gender, orientation, tags, bio } = req.body
	db.query('UPDATE users \
				SET (first_name, last_name, username, email, gender, orientation, tags, bio) = ($1, $2, $3, $4, $5, $6, $7, $8) \
				WHERE user_id = $9 RETURNING *',
		[firstName, lastName, username, email, gender, orientation, tags, bio, req.params.id], (err, res) => {
			
			if (res && res.rows[0])
				resp.status(200).send(res.rows[0])
			else if (res)
				resp.status(500).send({ error: 'User not found' })
			else 
				resp.status(500).send({ error: err.detail })
		})
})

usersRouter.delete('/:id', (req, resp) => {
	db.query('DELETE FROM users WHERE user_id = $1', [req.params.id], () => {
		resp.status(204).end()
	})
})

module.exports = usersRouter