'use strict';

const R = require('ramda');
const sports = require('./sports');
const getEvents = require('./getEvents');
const getOdds = require('./getOdds');
const {insertOdds, db} = require('../db/index');

(async () => {
	let n = 0;
	console.error('getting events');
	const events = await getEvents(sports.football);
	console.error('got events');
	await Promise.all(events.map(async event => {
		for await (const odd of getOdds(event)) {
			await insertOdds(odd);
			// console.log(JSON.stringify(odd));
			process.stderr.write('\r' + (++n));
		}
	}));
	db.end();
})();
