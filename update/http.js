'use strict';

const axios = require('axios');
const cheerio = require('cheerio');

const getPages = (url, sport, links) =>
	axios.get(url, sport)
		.then(response => {
			if (response.status === 200) {
				const html = response.data;
				const $ = cheerio.load(html);
				$('.flecha_izquierda').each((i, el) => {
					links.push({ url: 'http://www.elcomparador.com' + $(el).attr('href'), type: sport });
				});
			}
		})
		.catch(e => {
			console.log(e); // "Uh-oh!"
		});

const getPage = (db, links, index) =>
	axios.get(links[index].url)
		.then(response => {
			if (response.status !== 200) {
				return;
			}
			const html = response.data;
			const $ = cheerio.load(html);
			const content2get = $('#contenedor_evento_interna .ocultar #fila_cuotas #celda_cuotas:not(.combi_cesta):not(:contains("-"))').length;
			if (content2get === 0) {
				return getPage(links, ++index);
			}
			console.log('Odds to alter: ' + content2get + ' | Page nr: ' + index + '/' + (links.length - 1));
			console.log(' ');
			let int = 0;
			const markets = [];
			const bookies = [];
			const selections = [];
			const odds_list = [];
			$('#celda_interna_categoriaapuestas').each((i, el) => {
				markets.push($(el).text());
			});
			$('#fila_cuotas>#celda_logos>a').each((i, el) => {
				bookies.push($(el).attr('title').substring(5));
			});
			$('#contenedor_evento_interna').each((i, el) => {
				selections[markets[i]] = [];
				$(el).find('#fila_cuotas>#celda_categoria_interna>span').each((e, l) => {
					selections[markets[i]].push($(l).text());
				});
				$(el).find('.ocultar #fila_cuotas').each((e, l) => {
					$(l).find('#celda_cuotas:not(.combi_cesta):not(:contains("-"))').each((a, b) => {
						int++;
						back_odds = $(b).text(); // BACK_ODDS 7TH
						odds_list.push([
							links[index].type,
							$('.equipo_left').text() + ' vs ' + $('.equipo_right').text(),
							$('.hora').text().trim().split(' - ')[0].split('/').reverse().join('-') + ' ' + $('.hora').text().trim().split(' - ')[1],
							markets[i],
							selections[markets[i]][e],
							bookies[a]
						]);
					});
				});
			});
			if (content2get === int && odds_list.length > 0) {
				const sql = 'UPDATE `odds` SET `back_odds` = 999 WHERE category = ? AND name = ? AND time = ? AND market = ? AND selection = ? AND bookies = ?';
				for (let i = 0; i < odds_list.length; i++) {
					const query = db.query(sql, odds_list.pop(), (err, result) => {
						if (err) {
							throw err;
						}
					});
				}
				if (index < links.length - 1 && content2get !== 0) {
					getPage(links, ++index);
				} else {
					console.log('close');
				}
			}
		})
		.catch(e => {
			console.log(e); // "Uh-oh!"
			getPage(links, ++index);
		});

module.exports = { getPages, getPage };
