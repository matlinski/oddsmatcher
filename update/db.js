'use strict';

const mysql = require('mysql');

const db = mysql.createConnection({
	host: 'localhost',
	user: 'mat',
	password: 'tam',
	database: 'oddsmatcher'
});

db.connect(err => {
	if (err) {
		throw err;
	}
	console.log('Mysql Connected');
});

module.exports = db;
