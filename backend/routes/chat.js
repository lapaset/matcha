const db = require('../utils/db')
const router = require('express').Router()

router.get('/:id', (req, resp) => {

	db.query(`SELECT * FROM chat
	WHERE sender=$1 OR receiver=$1
	ORDER BY date ASC`, [req.params.id], (err, res) => {
		if (res)
			resp.status(200).send(res.rows)
		else
			resp.status(500).send({ error: err.detail })
	})
})

router.post('/', (req, resp) => {
	if (!req.body.to || !req.body.from || !req.body.msg)
		return resp.status(400).send({ error: 'required field missing' })

	db.query(`INSERT INTO chat (sender, receiver, msg)
	VALUES($1, $2, $3) RETURNING *`, [req.body.from, req.body.to, req.body.msg],
		(err, res) => {
			if (err)
				resp.status(500).send({ error: err.detail })
			else if (res && res.rows[0])
				resp.status(200).send(res.rows[0])
		})
})

module.exports = router