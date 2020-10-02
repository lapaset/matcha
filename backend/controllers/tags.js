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
    tagModel.addTag(req.body)
        .then(r => {
            res.status(200).send(r)
        })
        .catch(e => {
            res.status(500).send(e)
        })
})

module.exports = tagsRouter