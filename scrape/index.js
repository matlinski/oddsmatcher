'use strict';
const sports = require('./sports');
const getEvents = require('./getEvents');
const getOdds = require('./getOdds');
const insertOdds = require('../db/insertOdds');

(async () => {

	const events = await getEvents(sports.football);

	for await (const odd of getOdds(events[0])) {
		insertOdds(odd);
	}

})();
