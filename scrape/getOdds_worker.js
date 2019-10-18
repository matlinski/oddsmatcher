const {
	isMainThread, parentPort
} = require('worker_threads');

if (isMainThread) {
	return;
}

const { promisify } = require('util');
const axios = require('axios');
const cheerio = require('cheerio');

const sleep = promisify(setTimeout);

const parseDate = str => {
	const [ date, time ] = str.split('-').map(el => el.trim());
	return new Date(date.split('/').reverse().join('-') + ' ' + time);
};

const process = async url => {
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
					parentPort.postMessage({
						category: $('#separador_interna').attr('class'),
						home: $('#contenedor_interna_cabecerapartido')
							.find('.equipo_left').text(),
						away: $('#contenedor_interna_cabecerapartido')
							.find('.equipo_right').text(),
						time: parseDate($('#contenedor_interna_cabecerapartido')
							.find('.hora').text()),
						market: markets[i],
						selection: selections[e],
						bookie: bookies[f],
						back_odds: Number(back_odds.eq(f).text())
					});
				}
			}
		}
	}
};

(async function main() {
	const queue = [];
	parentPort.on('message', url => queue.push(url));
	while (true) {
		if (queue.length > 0) {
			await process(queue.shift());
			parentPort.postMessage('done');
		} else {
			await sleep(100);
		}
	}
})();
