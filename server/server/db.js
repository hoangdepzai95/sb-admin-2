
const mysql = require('mysql');

function createPool() {
  const pool = mysql.createPool({
    host     : 'us-cdbr-iron-east-05.cleardb.net',
    user     : 'bb3033653ece95',
    password : 'c6df4773',
    database : 'heroku_ee3ab49ef4f9427',
    connectionLimit: 50,
  });
  return pool;
}

let pool = createPool();

module.exports = pool;
