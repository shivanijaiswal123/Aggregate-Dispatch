const mysql = require("mysql");

var conn = mysql.createConnection({
  host: "us-cdbr-east-02.cleardb.com",
  user: "b712298c3e1c82",
  password: "cc1ad2cc",
  port: "3306",
  database: "heroku_8050956b50d627d",
  multipleStatements: true,
});

module.exports = conn;

// host: "127.0.0.1",
// port: "3306",
// user: "root",
// password: "root",
// database: "laundry",
