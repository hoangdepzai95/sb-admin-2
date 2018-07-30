
const mysql = require('mysql');

const isProd = process.argv.includes('--prod');

function createPool() {
  const pool = mysql.createPool({
    host     : '103.63.109.151',
    user     : 'monty',
    password : 'Kidvn95123@',
    database : isProd ? 'myapp' : 'hoang-app',
    connectionLimit: 300,
  });
  return pool;
}

let pool = createPool();

module.exports = pool;
