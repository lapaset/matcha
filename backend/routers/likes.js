const likesRouter = require('express').Router()
const db = require('../utils/db')

likesRouter.post('/', (req, resp) => {
	db.query('SELECT * FROM likes WHERE from_user_id = $1 AND to_user_id = $2',
		[req.body.from_user_id, req.body.to_user_id], (err, res) => {
			if (res && res.rows[0]) {
				db.query('DELETE FROM likes WHERE from_user_id = $1 AND to_user_id = $2',
				[req.body.from_user_id, req.body.to_user_id], (error, result) => {
					if (result)
						resp.status(200).send({message: "You just unliked this user"})
					else
						resp.status(500).send(error)
				})
			} else if (err){
				resp.status(501).send(err)
			}
			else{
				//resp.status(500).send(err)
				//db.query('DELETE FROM likes WHERE from_user_id = $1 AND to_user_id = $2')
				db.query('INSERT INTO likes (from_user_id, to_user_id) VALUES ($1, $2) RETURNING *',
				[req.body.from_user_id, req.body.to_user_id], (error, result) => {
					if (result)
						resp.status(200).send({message: "You just liked this user "})
					else
						resp.status(500).send(error)
				})
			}
	})
})

module.exports = likesRouter

//INSERT INTO users (from_user_id, to_user_id) VALUES ($1, $2)