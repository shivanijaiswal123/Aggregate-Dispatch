const mysql = require("mysql");

var conn = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  port: "3306",
  database: "Dispatch",
  multipleStatements: true,
});

module.exports = conn;
