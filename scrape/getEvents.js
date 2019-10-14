'use strict';

const axios = require('axios');
const cheerio = require('cheerio');

const getEvents = async (sportId = 1, date = new Date()) => {
	const { data } = await axios(
		'http://www.elcomparador.com/html/contenido/mas_partidos.php?deporte=' +
		sportId +
		'&fecha=' +
		date.toISOString().split('T')[0]);
	return data;
};

module.exports = getEvents;
