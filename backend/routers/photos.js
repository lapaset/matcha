const photosRouter = require('express').Router()
const db = require('../utils/db')

photosRouter.post('/', (req, resp) => {

	db.query('INSERT INTO photos (user_id, profile_pic, photo_str) \
	VALUES ($1, $2, $3) RETURNING id',
		[req.body.user_id, req.body.profilePic, req.body.photoStr],
		(err, res) => {
			if (res)
				resp.status(200).send(res.rows[0])
			else
				resp.status(500).send(err)
		})
})

photosRouter.delete('/:id', (req, resp) => {

	db.query('DELETE FROM photos WHERE id = $1',
	[req.params.id], (err, res) => {
		if (err)
			console.log('error', err)
		resp.status(204).end()
	})
})

module.exports = photosRouter