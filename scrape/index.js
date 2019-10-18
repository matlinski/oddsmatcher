'use strict';

const sports = require('./sports');
const getEvents = require('./getEvents');
const getOdds = require('./getOdds');
const {insertOdds, db} = require('../db/index');

(async () => {
	let n = 0;
	const events = await getEvents(sports.football);
	await Promise.all(events.map(async event => {
		for await (const odd of getOdds(event)) {
			await insertOdds(odd);
			process.stdout.write('\r' + (++n));
		}
	}));
	db.end();
})();
