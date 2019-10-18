'use strict';
const mysql = require('mysql');
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

const insertOdds = ({category, home, away, time, market, selection, bookie, back_odds}) => {
    let sql = 'INSERT IGNORE INTO `odds` (`category`, `home`, `away`, `time`, `market`, `selection`, `bookie`, `back_odds`) VALUES (?)';
    let query = db.query(sql, [[category, home, away, time, market, selection, bookie, back_odds]], (err, result) => {
        if(err){
            throw err;
        }
        console.log(result);
    })
};

module.exports = insertOdds;