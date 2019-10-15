'use strict';

const R = require('ramda');
const axios = require('axios');
const cheerio = require('cheerio');

const getOddsData = ($, bookies, data) => {
	const teams = $(data)
		.find('.ancho_celda_categoria_interna #celda_categoria_interna > span')
		.toArray()
		.map(x => $(x).text());
	console.log(teams[0]);
	// where I left off, needs fixing
};

const getOdds = async url => {
	const { data } = await axios(url);
	const $ = cheerio.load(data);
	const bookies = $('#contenedor_logos a')
		.toArray()
		.map(el => $(el).attr('title').split(' ').pop());
	return R.splitEvery(2, $('#anclaje')
		.nextAll()
		.toArray())
		.map(([ title, data ]) => ({
			name: $(title).find('#celda_interna_categoriaapuestas').text(),
			data: getOddsData($, bookies, data)
		}));
	
	// old code
	for(let i = 0; i<markets.length; i++){

		let selections = $('#contenedor_evento_interna').eq(i).find('.variante_interna_apuesta>span').map((e, l)=> $(l).text())
		for(let e = 0; e<selections.length; e++){
			let back_odds = $('#contenedor_evento_interna').eq(i).find('.ocultar').find('[id="fila_cuotas"]').eq(e).find('[id="celda_cuotas"]:not(.combi_cesta)'); //:not(:contains("-"))
			for(let f = 0; f<back_odds.length; f++){
				if(!back_odds.eq(f).text().includes('-')) console.log('market: '+markets[i]+' | selection: '+selections[e]+' | bookie: '+bookies[f]+' | odds: '+back_odds.eq(f).text());
			}
		}
	}

	 return '';
	// {
	// 	category: $('#separador_interna').attr('class'),
	// 	team1: $('#contenedor_interna_cabecerapartido').find('.equipo_left').text(),
	// 	team2: $('#contenedor_interna_cabecerapartido').find('.equipo_right').text(),
	// 	time: $('#contenedor_interna_cabecerapartido').find('.hora').text(),

	// };
};

module.exports = getOdds;
