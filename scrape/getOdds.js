'use strict';

const axios = require('axios');
const cheerio = require('cheerio');

const getOdds = async url => {
	const { data } = await axios(url);
	const $ = cheerio.load(data);
	const list = [];
	const bookies = $('.fondo_fila_logos').find('.logos_lleno_interna>a').map((i, el)=>$(el).attr('title').substring(5));
	const markets = $('#contenedor_interna_categoriaapuestas #celda_interna_categoriaapuestas').map((i, el)=>$(el).text());
	for(let i = 0; i<markets.length; i++){
		let selections = $('[id="contenedor_evento_interna"]').eq(i).find('.variante_interna_apuesta>span').map((e, l)=> $(l).text())
		for(let e = 0; e<selections.length; e++){
			let back_odds = $('[id="contenedor_evento_interna"]').eq(i).find('.ocultar').find('[id="fila_cuotas"]').eq(e).find('[id="celda_cuotas"]:not(.combi_cesta)'); //:not(:contains("-"))
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
