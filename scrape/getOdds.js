'use strict';

const axios = require('axios');
const cheerio = require('cheerio');

const getOdds = async url => {
	const { data } = await axios(url);
	const $ = cheerio.load(data);
	const bookies = $('.fondo_fila_logos').find('.logos_lleno_interna>a').map((i, el)=>$(el).attr('title').substring(5));
	const markets = $('#contenedor_interna_categoriaapuestas #celda_interna_categoriaapuestas').map((i, el)=>$(el).text());


	return {
		category: $('#separador_interna').attr('class'),
		team1: $('#contenedor_interna_cabecerapartido').find('.equipo_left').text(),
		team2: $('#contenedor_interna_cabecerapartido').find('.equipo_right').text(),
		time: $('#contenedor_interna_cabecerapartido').find('.hora').text(),

	};
};

module.exports = getOdds;
