const { Pool } = require('pg');
const debug = require('debug')('app:postgres');
require('dotenv').config();

// loads configuraiton from environnement variables overrided by '.env' file
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
});

// The list of all users
async function getUsers() {
  debug(`getUsers()`);
  const result = await pool.query('SELECT username, email FROM users;');
  return result.rows;
}

// Inserts a user
async function addUser(username, email, pwd) {
  debug(`addUser("${username}", "${email}", "${pwd}")`);
  const result = await pool.query('INSERT INTO users(username, email, password) VALUES ($1, $2, $3);', [
    username,
    email,
    pwd,
  ]);
  return result;
}

// Boolean query to check a user/password
async function checkUser(login, pwd) {
  debug(`checkUser("${login}", "${pwd}")`);
  const result = await pool.query('SELECT  FROM users WHERE username=$1 AND password=$2;', [login, pwd]);
  return result.rowCount === 1;
}

module.exports = { getUsers, checkUser, addUser };
