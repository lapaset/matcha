const db = require('../utils/db')

const findUser = user => {
	db.query('SELECT user_id, first_name, last_name, username, email, verified, \
	token, password, gender, orientation, bio, tags, AGE(birthdate) as age, \
	id, profile_pic, longitude, latitude \
	FROM users \
	LEFT OUTER JOIN photos USING (user_id) \
	WHERE username= $1', [user.username], async (err, res) => {


		if (err)
			return ({ error: 'Database error' })
		if (res.rowCount === 0)
			return ({ error: 'Invalid username or password' })

		console.log('res', res.rows[0])
		return ({ username: 'kakkels' })
		//return res.rows[0]

	})
}

module.exports = { findUser }