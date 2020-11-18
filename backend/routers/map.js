const mapUpdateRouter = require('express').Router()
const db = require('../utils/db')

mapUpdateRouter.put('/', (req, resp) => {
	db.query('UPDATE users SET latitude = $1, longitude = $2 WHERE user_id = $3',
		[req.body.latitude, req.body.longitude, req.body.user_id], (err, res) => {
			if (res && res.rowCount === 1) {
                resp.status(200).send({message: "Your location has been updated"})
			} else {
				resp.status(500).send(err)
			}
	})
})

module.exports = mapUpdateRouter