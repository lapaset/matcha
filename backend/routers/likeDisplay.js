const likesDisplayRouter = require('express').Router()
const db = require('../utils/db')

likesDisplayRouter.post('/', (req, resp) => {
	db.query('SELECT * FROM likes WHERE from_user_id = $1 AND to_user_id = $2',
	[req.body.from_user_id, req.body.to_user_id], (err, res) => {
		if (res && res.rows[0])
		{
			resp.status(200).send({ value: 1 })
		}
		else if (res)
			resp.status(200).send({ value: 0 })
		else
			resp.status(400).send({ value: "Query execution failed"});
	}
	)
})

module.exports = likesDisplayRouter