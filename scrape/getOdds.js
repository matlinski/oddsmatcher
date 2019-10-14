'use strict';

const axios = require('axios');
const cheerio = require('cheerio');

const getOdds = async url => {
	const { data } = await axios(url);
	const $ = cheerio.load(data);

	return '?';
};
