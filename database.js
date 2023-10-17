const mysql = require('mysql2');
require('dotenv').config();
//Setup Database
const pool = mysql.createPool( {
    host: "sg1-ts6.a2hosting.com",
    user: "missio20_2307-L4FT11-team2",
    password: "2DDLc1G8vzoZ",
    database: "missio20_2307-L4FT11-team2",
    waitForConnections: true, // Allow queuing when true
    connectionLimit: 10, // Max number of connections at a time
    queueLimit: 0, // As many people can queue and wait for a spot
})


module.exports = pool;
