const mysql = require("mysql2");

const db = mysql.createConnection({
    host: "localhost",
    user: "studb030",
    password: "abc123",     // a tanár ezt adta mindenkinél
    database: "db030",
    port: 3306
});

db.connect();

module.exports = db;
