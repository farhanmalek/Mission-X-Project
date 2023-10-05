const mysql = require('mysql2');
require('dotenv').config();
//Setup Database
const pool = mysql.createPool( {
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASS,
    database: process.env.MYSQL_DATABASE,
    waitForConnections: true, // Allow queuing when true
    connectionLimit: 10, // Max number of connections at a time
    queueLimit: 0, // As many people can queue and wait for a spot
})


module.exports = pool;
