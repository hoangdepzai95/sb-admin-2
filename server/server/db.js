
const mysql = require('mysql');

function createPool() {
  const pool = mysql.createPool({
    host     : '103.63.109.86',
    user     : 'monty',
    password : 'Kidvn95123@',
    database : 'dat',
    connectionLimit: 1000,
  });
  return pool;
}

let pool = createPool();

module.exports = pool;
