const router = require('express').Router()
const db = require('../utils/db')

router.get('/', (req, resp) => {

	if (req.query.user_id)
		db.query('SELECT * FROM notifications WHERE user_id=$1 ORDER BY date DESC',
			[req.query.user_id], (err, res) => {
				if (res)
					resp.status(200).send(res.rows)
				else
					resp.status(500).send({ error: err.detail })
			})

	else
		db.query('SELECT * FROM notifications ORDER BY date DESC', [], (err, res) => {
			if (res)
				resp.status(200).send(res.rows)
			else
				resp.status(500).send({ error: err.detail })
		})
})

router.post('/', (req, resp) => {
	db.query('INSERT INTO notifications (user_id, notification) \
	VALUES ($1, $2) RETURNING *', [req.body.user_id, req.body.notification],
		(err, res) => {
			if (res)
				resp.status(201).send(res.rows[0])
			else
				resp.status(500).send({ error: err.detail })
		})
})

router.patch('/:id', (req, resp) => {
	db.query('UPDATE notifications SET read = 1 WHERE id = $1',
		[req.params.id], (err, res) => {
			if (res)
				resp.status(204).end()
			else
				resp.status(500).send({ error: err.detail })
		})
})

module.exports = router