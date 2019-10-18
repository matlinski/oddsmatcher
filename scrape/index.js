'use strict';
const sports = require('./sports');
const getEvents = require('./getEvents');
const getOdds = require('./getOdds');
const {insertOdds, db} = require('../db/index');

(async () => {

	const events = await getEvents(sports.football);
	for (const event of events) {
		for await (const odd of getOdds(event)) {
			console.log(await insertOdds(odd));
		}
	}
	db.end();
})();
