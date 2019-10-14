'use strict';

const { URL } = require('url');
const qs = require('querystring');

const axios = require('axios');
const cheerio = require('cheerio');

const getEvents = async (sportId = 1, date = new Date(), offset = 0) => {
	const url = 'http://www.elcomparador.com/html/contenido/mas_partidos.php?' +
		qs.stringify({
			deporte: sportId,
			fecha: date.toISOString().split('T')[0],
			offset
		});
	const { data } = await axios(url);
	const $ = cheerio.load(data);
	return $('.flecha_izquierda')
		.toArray()
		.map(el => $(el).attr('href'))
		.map(u => new URL(u, url).href);
};

module.exports = getEvents;
