'use strict';

const { Worker } = require('worker_threads');

const { PassThrough } = require('stream');

const { promisify } = require('util');
const { join } = require('path');

const axios = require('axios');

const workers = Array(4).fill(null).map(() =>
	new Worker(join(__dirname, 'getOdds_worker.js')));

let n = 0;

const getOdds = url => {
	const worker = workers[n % workers.length];
	const s = new PassThrough({ objectMode: true });
	n = (n + 1) % workers.length;

	const run = row => {
		if (typeof row === 'string') {
			if (row !== 'done ' + url) {
				console.warn('unknown finish message: ' + row);
			}
			worker.removeListener('message', run);
			return;
		}
		s.write(row);
	};

	const start = msg => {
		if (typeof msg === 'string' && msg === 'start ' + url) {
			worker.removeListener('message', start);
			worker.on('message', run);
		}
	};
	worker.on('message', start);
	axios(url)
		.then(res =>
			worker.postMessage([ url, res.data ]));
	return s;
}

module.exports = getOdds;
