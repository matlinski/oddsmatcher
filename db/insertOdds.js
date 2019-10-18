'use strict';

const db = require('./conn');

const insertOdds = ({category, home, away, time, market, selection, bookie, back_odds}) => 
    new Promise((resolve, reject) => {
        let sql = 'INSERT IGNORE INTO `odds` (`category`, `home`, `away`, `time`, `market`, `selection`, `bookie`, `back_odds`) VALUES (?)';
        let query = db.query(sql, [[category, home, away, time, market, selection, bookie, back_odds]], (err, result) => {
            if(err){
                reject(err);
            }
            resolve(result)
        })
    });

module.exports = insertOdds;