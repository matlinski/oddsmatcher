'use strict';

const axios = require('axios');
const cheerio = require('cheerio');

const getOdds = async url => {
	const { data } = await axios(url);
	const $ = cheerio.load(data);

	const bookies = $('#contenedor_logos a')
		.toArray()
		.map(el => $(el).attr('title').split(' ').pop());

	const markets =
		$('#contenedor_interna_categoriaapuestas')
			.find('#celda_interna_categoriaapuestas')
			.toArray()
			.map(el => $(el).text());

	const result = [];

	for (let i = 0; i < markets.length; i++) {

		const selections = $('#contenedor_evento_interna')
			.eq(i)
			.find('.variante_interna_apuesta>span')
			.map((e, l)=> $(l).text());
		for (let e = 0; e < selections.length; e++) {
			const back_odds = $('#contenedor_evento_interna')
				.eq(i)
				.find('.ocultar')
				.find('[id="fila_cuotas"]')
				.eq(e)
				.find('[id="celda_cuotas"]:not(.combi_cesta)');
				// :not(:contains("-"))
			for (let f = 0; f < back_odds.length; f++) {
				if (!back_odds.eq(f).text().includes('-')) {
					result.push({
						market: markets[i],
						selection: selections[e],
						bookie: bookies[f],
						odds: back_odds.eq(f).text()
					});
				}
			}
		}
	}

	return result;
};

module.exports = getOdds;
