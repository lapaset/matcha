const likesRouter = require('express').Router()
const db = require('../utils/db')

likesRouter.get('/:id', (req, resp) => {
	db.query('SELECT * FROM likes WHERE from_user_id = $1',
		[req.params.id], (err, res) => {
			if (res)
				resp.status(200).send(res.rows)
			else
				resp.status(500).send({ error: err.detail })
		})
})

likesRouter.post('/', (req, resp) => {
	db.query('SELECT * from likes WHERE from_user_id=$1 AND to_user_id=$2 OR from_user_id=$2 AND to_user_id=$1;',
		[req.body.from_user_id, req.body.to_user_id], (err, res) => {
			if (res && res.rows[0]) {
				console.log("res", res.rows)
				const userLike = res.rows.find(r => r.from_user_id === req.body.from_user_id)
				const matchLike = res.rows.find(r => r.to_user_id === req.body.from_user_id)

				if (userLike) {
					console.log('already liked, unlike')
					db.query('DELETE FROM likes WHERE like_id=$1',
						[userLike.like_id], (error, result) => {
							if (result) {
								console.log("matchLike", matchLike)
								if (matchLike && matchLike.match) {
									console.log('should come here')
									//remove the match if needed				

									db.query('UPDATE likes SET match=0 WHERE like_id=$1',
										[matchLike.like_id], (err, res) => {
											if (res)
												resp.status(200).send({ value: 0 })
											else
												resp.status(500).send(error)
										})
								} else
									resp.status(200).send({ value: 0 })
							}
							else
								resp.status(500).send(error)
						})


				} else {
					console.log('its a match!')
					//add a like and the match
					db.query('INSERT INTO likes (from_user_id, to_user_id, match) VALUES ($1, $2, $3) RETURNING *',
						[req.body.from_user_id, req.body.to_user_id, 1], (error, result) => {
							if (result) {
								db.query('UPDATE likes SET match=1 WHERE like_id=$1',
									[matchLike.like_id], (err, res) => {
										if (res)
											resp.status(200).send({ value: 1 })
										else
											resp.status(500).send(error)
									})
							}
							else
								resp.status(500).send(error)
						})

				}
			}
			else if (res) {
				//tassa tapauksessa lisaa vaan like
				db.query('INSERT INTO likes (from_user_id, to_user_id, match) VALUES ($1, $2, $3) RETURNING *',
					[req.body.from_user_id, req.body.to_user_id, 0], (error, result) => {
						if (result)
							resp.status(200).send({ value: 1 })
						else
							resp.status(500).send(error)
					})
			}
			else
				console.log(err)
		})

	/*
	db.query('SELECT * FROM likes WHERE from_user_id = $1 AND to_user_id = $2',
		[req.body.from_user_id, req.body.to_user_id], (err, res) => {
			if (res && res.rows[0]) {
				db.query('DELETE FROM likes WHERE from_user_id = $1 AND to_user_id = $2',
					[req.body.from_user_id, req.body.to_user_id], (error, result) => {
						if (result)
							resp.status(200).send({ value: 0 })
						else
							resp.status(500).send(error)
					})
			} else if (err) {
				resp.status(501).send(err)
			}
			else {
				//resp.status(500).send(err)
				//db.query('DELETE FROM likes WHERE from_user_id = $1 AND to_user_id = $2')
				db.query('INSERT INTO likes (from_user_id, to_user_id) VALUES ($1, $2) RETURNING *',
					[req.body.from_user_id, req.body.to_user_id], (error, result) => {
						if (result)
							resp.status(200).send({ value: 1 })
						else
							resp.status(500).send(error)
					})
			}
		})*/
})

module.exports = likesRouter

//INSERT INTO users (from_user_id, to_user_id) VALUES ($1, $2)