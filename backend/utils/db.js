const config = require('./config')
const Pool = require('pg').Pool

const pool = new Pool({
	user: config.PG_USER,
	host: config.PG_HOST,
	database: config.PG_DB,
	password: config.PG_PW,
	port: config.PG_PORT,
})

module.exports = () => { return pool }