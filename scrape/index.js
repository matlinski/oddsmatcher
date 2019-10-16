'use strict';

const sports = require('./sports');
const getEvents = require('./getEvents');
const getOdds = require('./getOdds');

(async () => {

	const events = await getEvents(sports.football);

	for await (const odd of getOdds(events[0])) {
		console.log(odd);
	}

})();
