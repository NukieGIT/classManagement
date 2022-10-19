var mariadb = require('mariadb');

var pool =
    mariadb.createPool({
        host: "localhost",
        port: 3306,
        user: "root",
        password: "",
        database: "classmanagement",
        connectionLimit: 5
    });

module.exports = Object.freeze({
    pool: pool
});