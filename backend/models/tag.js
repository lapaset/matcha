const db = require('../utils/db')

const getTags = () => {
    return new Promise((resolve, reject) => {
		db.query('SELECT * FROM tags', (error, results) => {
			if (error)
				reject(error)
			else
				resolve(results.rows)
		})
	})
}

const addTag = body => {
    return new Promise((resolve, reject) => {
        db.query('INSERT INTO tags (tag) VALUES ($1)', [body.tag], (error, results) => {
            if (error)
                reject(error)
            else
                resolve(body.tag)
        })
    })
}

module.exports = {
    getTags,
    addTag
}