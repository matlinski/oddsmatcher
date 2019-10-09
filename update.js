const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs'); 
const mysql = require('mysql');


let back_odds;
const links = [];
const sports = [{id: 1, name: 'fútbol'}, {id: 2, name: 'tenis'}, {id: 23, name: 'baloncesto'}]

const db = mysql.createConnection({
    host: "localhost",
    user: "mat",
    password: "tam",
    database: 'oddsmatcher'
});

db.connect((err)=> {
    if(err){
        throw err;
    }
    console.log('Mysql Connected')
});

const app = express();

app.listen('3000', () => {
    console.log('Server started on port 3000');
});

function addDays(date, amount) {
    var tzOff = date.getTimezoneOffset() * 60 * 1000,
        t = date.getTime(),
        d = new Date(),
        tzOff2;
  
    t += (1000 * 60 * 60 * 24) * amount;
    d.setTime(t);
  
    tzOff2 = d.getTimezoneOffset() * 60 * 1000;
    if (tzOff != tzOff2) {
      var diff = tzOff2 - tzOff;
      t += diff;
      d.setTime(t);
    }
  
    return d;
  }

function getPages(url, sport){
    axios.get(url, sport)
    .then((response) => {
        if(response.status === 200) {
            const html = response.data;
            const $ = cheerio.load(html);
            $('.flecha_izquierda').each( (i, el) =>{
                links.push({url: 'http://www.elcomparador.com'+$(el).attr('href'), type: sport})
            })
        }
    })
    .catch(function(e) {
        console.log(e); // "Uh-oh!"
    });
}

 let day;
 new Promise((resolve, reject) => {
     let sourceNum = 0;
     sports.forEach((sport)=>{
        day = addDays(new Date(), 0).toISOString().replace(/T/, ' ').replace(/\..+/, '').split(' ')[0];
        getPages('http://www.elcomparador.com/html/contenido/mas_partidos.php?deporte='+sport.id+'&fecha='+day, sport.name);
        for(let inc = 1; inc < 2; inc++){
            day = addDays(new Date(), inc).toISOString().replace(/T/, ' ').replace(/\..+/, '').split(' ')[0];
            for(let offset = 30; offset <=40; offset += 30){
                sourceNum++;
                getPages('http://www.elcomparador.com/html/contenido/mas_partidos.php?deporte='+sport.id+'&fecha='+day+'&offset='+offset, sport.name);
            }
        }
    })
    setTimeout(()=>{
        resolve();
    }, sourceNum*200)
})
.then((response)=>{
        getPage(links, 0);
})

function getPage(links, index){
    axios.get(links[index].url)
    .then((response)=>{
        if(response.status === 200){
            const html = response.data;
            const $ = cheerio.load(html);
            let content2get = $('#contenedor_evento_interna .ocultar #fila_cuotas #celda_cuotas:not(.combi_cesta):not(:contains("-"))').length;
            if(content2get !== 0){
                console.log('Odds to alter: '+content2get+' | Page nr: '+index+'/'+(links.length-1) );
                console.log(' ');
                let int = 0;
                const markets = [];
                const bookies = [];
                const selections = [];
                const odds_list = [];
                $('#celda_interna_categoriaapuestas').each((i, el)=>{
                    markets.push($(el).text());
                });
                $('#fila_cuotas>#celda_logos>a').each((i, el)=>{
                    bookies.push($(el).attr('title').substring(5));
                });
                $('#contenedor_evento_interna').each((i, el)=>{
                    selections[markets[i]] = [];
                    $(el).find('#fila_cuotas>#celda_categoria_interna>span').each((e, l)=>{
                        selections[markets[i]].push( $(l).text());
                    });
                    $(el).find('.ocultar #fila_cuotas').each((e, l)=>{
                        $(l).find('#celda_cuotas:not(.combi_cesta):not(:contains("-"))').each((a, b)=>{
                            int++;
                            back_odds = $(b).text(); //BACK_ODDS 7TH
                            odds_list.push([
                                links[index].type,
                                $('.equipo_left').text()+' vs '+$('.equipo_right').text(),
                                $('.hora').text().trim().split(' - ')[0].split('/').reverse().join('-')+' '+$('.hora').text().trim().split(' - ')[1],
                                markets[i],
                                selections[markets[i]][e],
                                bookies[a]
                            ]);
                        })
                    });
                });
                if(content2get === int && odds_list.length > 0){
                    let sql = 'UPDATE `odds` SET `back_odds` = 999 WHERE category = ? AND name = ? AND time = ? AND market = ? AND selection = ? AND bookies = ?';
                    for(let i = 0; i < odds_list.length; i++){
                         let query = db.query(sql,  odds_list.pop(), (err, result) => {
                                if(err){
                                    throw err;
                                }
                        })
                    }
                    if(index < links.length-1 && content2get !== 0){
                        getPage(links, ++index);
                    }   else    {
                        console.log('close');
                    }
                }
            }      else    {
                getPage(links, ++index);
            }
        }
    })
     .catch(function(e) {
         console.log(e); // "Uh-oh!"
        getPage(links, ++index);
     });
}