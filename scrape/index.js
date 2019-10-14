'use strict';

const sports = require('./sports');
const getEvents = require('./getEvents');
const getOdds = require('./getOdds');

(async () => {

	const events = await getEvents(sports.football);

	const odds = await getOdds(events[0]);

	console.log(odds);
})();
