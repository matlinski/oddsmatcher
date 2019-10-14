'use strict';

const { URL } = require('url');
const qs = require('querystring');

const axios = require('axios');
const cheerio = require('cheerio');

const sports = require('./sports');

const getEvents = async (sport = sports.football, date = new Date(), offset = 0) => {
	const url = 'http://www.elcomparador.com/html/contenido/mas_partidos.php?' +
		qs.stringify({
			deporte: sport,
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
