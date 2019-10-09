'use strict';

const addDays = (date, amount) => {
	const tzOff = date.getTimezoneOffset() * 60 * 1000;
	let t = date.getTime();
	const d = new Date();

	t += 1000 * 60 * 60 * 24 * amount;
	d.setTime(t);

	const tzOff2 = d.getTimezoneOffset() * 60 * 1000;
	if (tzOff !== tzOff2) {
		const diff = tzOff2 - tzOff;
		t += diff;
		d.setTime(t);
	}

	return d;
};

module.exports = { addDays };
