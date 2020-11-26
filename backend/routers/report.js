const reportRouter = require('express').Router()
const db = require('../utils/db')

reportRouter.post('/', (req, resp) => {
	db.query('SELECT * FROM report WHERE from_user_id = $1 AND to_user_id = $2',
		[req.body.from_user_id, req.body.to_user_id], (err, res) => {
			if (res && res.rows[0]) {
				resp.status(200).send({message: "You already report this user"})
			} else if (err){
				resp.status(501).send(err)
			}
			else{
				db.query('INSERT INTO report (from_user_id, to_user_id) VALUES ($1, $2) RETURNING *',
				[req.body.from_user_id, req.body.to_user_id], (error, result) => {
					if (result)
						resp.status(200).send({message: "Your report has been submitted!"})
					else
						resp.status(500).send(error)
				})
			}
	})
})

module.exports = reportRouter