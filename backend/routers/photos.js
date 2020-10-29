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

module.exports = photosRouter