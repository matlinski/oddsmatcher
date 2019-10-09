'use strict';

const axios = require('axios');
const cheerio = require('cheerio');

const links = [];
const sports = [ { id: 1, name: 'fútbol' }, { id: 2, name: 'tenis' }, { id: 23, name: 'baloncesto' } ];

const db = require('./db');

const { addDays } = require('./dates');

const { getPages, getPage } = require('./http');

let day;
new Promise((resolve, reject) => {
	let sourceNum = 0;
	sports.forEach(sport => {
		day = addDays(new Date(), 0).toISOString().replace(/T/, ' ').replace(/\..+/, '')
			.split(' ')[0];
		getPages('http://www.elcomparador.com/html/contenido/mas_partidos.php?deporte=' + sport.id + '&fecha=' + day, sport.name, links);
		for (let inc = 1; inc < 2; inc++) {
			day = addDays(new Date(), inc).toISOString().replace(/T/, ' ').replace(/\..+/, '')
				.split(' ')[0];
			for (let offset = 30; offset <= 40; offset += 30) {
				sourceNum++;
				getPages('http://www.elcomparador.com/html/contenido/mas_partidos.php?deporte=' + sport.id + '&fecha=' + day + '&offset=' + offset, sport.name, links);
			}
		}
	});
	setTimeout(() => {
		resolve();
	}, sourceNum * 200);
})
	.then(response => {
		getPage(db, links, 0);
	});
