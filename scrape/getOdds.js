'use strict';

const {
	Worker, isMainThread
} = require('worker_threads');

if (!isMainThread) {
	return;
}

const { join } = require('path');
const axios = require('axios');

const workers = [
	new Worker(join(__dirname, 'getOdds_worker.js')),
	new Worker(join(__dirname, 'getOdds_worker.js')),
	new Worker(join(__dirname, 'getOdds_worker.js')),
	new Worker(join(__dirname, 'getOdds_worker.js'))
]

workers.forEach(worker => worker.unref());

let n = 0;

async function* getOdds(url) {
	const worker = workers[n % workers.length];
	n = (n + 1) % workers.length;
	worker.postMessage(url);
	while (true) {
		const val = await new Promise(resolve =>
			worker.once('message', resolve));
		if (val === 'done') {
			return;
		}
		yield val;
	}
}

module.exports = getOdds;
