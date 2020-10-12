const tagModel = require('../models/tag')
const tagsRouter = require('express').Router()

tagsRouter.get('/', (req, res) => {
    tagModel.getTags()
        .then(tags => {
            res.status(200).send(tags)
        })
        .catch(error => {
            res.status(500).send(error)
        })
})

tagsRouter.post('/', (req, res) => {
	if (!req.body.tag) {
		return res.status(400).json({ error: 'tag missing' })
	}

    tagModel.addTag(req.body)
        .then(r => {
            res.status(200).send(r)
        })
        .catch(e => {
            res.status(500).json({
				error: e.detail
			})
        })
})

module.exports = tagsRouter