const blockRouter = require('express').Router()
const db = require('../utils/db')
const jwt = require('jsonwebtoken')
const tokenSecret = require('../utils/config').TOKEN_SECRET

blockRouter.post('/', (req, resp) => {
	const user = jwt.verify(req.token, tokenSecret)

	if (!user)
		return resp.status(401).json({ error: 'token missing or invalid' })

	db.query('INSERT INTO blocked (from_user_id, to_user_id) VALUES ($1, $2) RETURNING *',
		[user.user_id, req.body.to_user_id], (err, res) => {
			if (res)
				resp.status(200).send(res.rows);
			else if (err.code === '23505')
				resp.status(204).end()
			else
				resp.status(500).send(err);
		})
})

blockRouter.post('/no-access', (req, resp) => {
	db.query('SELECT * FROM blocked\
	WHERE (from_user_id = $1 AND to_user_id = $2) OR (from_user_id = $2 AND to_user_id = $1)',
		[req.body.from_user_id, req.body.to_user_id], (err, res) => {
			if (res && res.rows[0]) {
				resp.status(200).send({ value: 1 })
			}
			else if (res)
				resp.status(200).send({ value: 0 })
			else
				resp.status(400).send({ value: "Query execution failed" });
		}
	)
})

blockRouter.get('/:id', (req, resp) => {
	db.query('SELECT username, block_id, from_user_id, to_user_id FROM blocked\
	INNER JOIN users ON to_user_id = users.user_id\
	WHERE to_user_id = $1 OR from_user_id = $1',
		[req.params.id], (err, res) => {
			if (res)
				resp.status(200).send(res.rows)
			else
				resp.status(500).send(err)
		})
})

blockRouter.delete('/:id', (req, resp) => {

	if (!jwt.verify(req.token, tokenSecret))
		return resp.status(401).json({ error: 'token missing or invalid' })

	db.query('DELETE FROM blocked WHERE block_id = $1',
		[req.params.id], (err, res) => {
			if (res)
				resp.status(204).end();
			else
				resp.status(500).send(err);
		})
})

module.exports = blockRouter;