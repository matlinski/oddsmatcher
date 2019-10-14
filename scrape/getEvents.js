'use strict';

const qs = require('querystring');

const axios = require('axios');
const cheerio = require('cheerio');

const getEvents = async (sportId = 1, date = new Date(), offset = 0) => {
	const { data } = await axios(
		'http://www.elcomparador.com/html/contenido/mas_partidos.php?' +
		qs.stringify({
			deporte: sportId,
			fecha: date.toISOString().split('T')[0],
			offset
		}));
	return data;
};

module.exports = getEvents;
