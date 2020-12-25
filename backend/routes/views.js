const viewsRouter = require('express').Router()
const db = require('../utils/db')

/*
viewsRouter.post('/', (req, resp) => {
	db.query('INSERT INTO views (from_user_id, to_user_id) VALUES ($1, $2) RETURNING *',
		[req.body.from_user_id, req.body.to_user_id], (err, res) => {
			if (res)
				resp.status(200).send({ message: "Views inserted" });
			else
				resp.status(500).send(err);
		})
})
*/
viewsRouter.post('/', (req, resp) => {
	db.query('DELETE FROM views WHERE from_user_id = $1 AND to_user_id = $2',
		[req.body.from_user_id, req.body.to_user_id], (err, res) => {
        if (res)
        {
            db.query('INSERT INTO views (from_user_id, to_user_id) VALUES ($1, $2) RETURNING *', 
            [req.body.from_user_id, req.body.to_user_id], (errors, results) => {
                if (results)
                    resp.status(200).send({message: "DELETED and inserted"})
                else
                    resp.status(500).send(errors)
            })
        }
        else
            resp.status(500).send(err);
		})
})

viewsRouter.post('/list', (req, resp) => {
    db.query('Select t.username to_visit_username, F.username from_visit_username, \
    from_user_id, to_user_id From views v \
    Join users t on v.to_user_id = t.user_id\
    Join users f on v.from_user_id = f.user_id\
    Where $1 in (f.username, t.username) order by view_id desc',
		[req.body.username], (err, res) => {
			if (res)
				resp.status(200).send(res.rows);
			else
				resp.status(500).send(err);
		})
})

module.exports = viewsRouter;